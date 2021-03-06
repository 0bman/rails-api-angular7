# frozen_string_literal: true

class Api::V1::SessionsController < Api::V1::BaseController
  skip_before_action :authenticate!, only: %i[create]

  def new
    serializer = UserSerializer.new(current_user)
    render json: serializer
  end

  def create
    return redirect_to success_front_root_path if sign_in_user_with_provider

    user = User.find_by(email: session_params[:email])
    if user&.authenticate(session_params[:password])
      assign_jwt_cookies(user)
      render json: UserSerializer.new(user)
    else
      render json: { error: 'incorrect email or password combination' }
    end
  end

  def destroy
    cookies.delete :jwt
    head :ok
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end

  def sign_in_user_with_provider
    auth = request.env['omniauth.auth']
    return unless auth
    token = auth['credentials']['token']

    user = User.find_or_create_user_with_provider(auth)
    assign_jwt_cookies(user, token)
    user
  end
end
