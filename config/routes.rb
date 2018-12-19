Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

	namespace :api do
    namespace :v1 do
			resources :categories
  		resources :tasks
    end
	end

	get '*path', to: "application#fallback_index_html", constraints: ->(request) do
	  !request.xhr? && request.format.html?
	end
	
end
