Rails.application.routes.draw do
  resources :events
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "events#index"

	get '/ping', to: 'events#ping'


end
