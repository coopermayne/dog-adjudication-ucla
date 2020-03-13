Rails.application.routes.draw do
  #get 'sessions/new'
  #get 'sessions/create'
  #get 'sessions/login'
  #get 'sessions/welcome'
  #get 'users/new'
  #get 'users/create'
  resources :events
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "events#index"

	get '/ping', to: 'events#ping'

	get 'login', to: 'sessions#login'
	post 'login', to: 'sessions#create'
	get 'welcome', to: 'sessions#welcome'

end
