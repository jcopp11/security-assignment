namespace :assignment do
  MEMBERS=["mike","carol","alice","greg","marsha","peter","jan","bobby","cindy", "sam","emmanuel"]
  ADMINS=["mike","carol"]
  ORIGINATORS=["carol","alice","emmanuel"]
  BOYS=["greg","peter","bobby","emmanuel"]
  GIRLS=["marsha","jan","cindy"]



  def user_name first_name
    last_name = (first_name=="alice"|| first_name=="emmanuel") ? "nelson" : "brady"
    case first_name
    when "alice"
      last_name = "nelson"

    when "emmanuel"
      last_name="alcime"  
    when "sam"
      last_name = "franklin"
    else
      last_name = "brady"
    end
    "#{first_name} #{last_name}".titleize
  end


  def user_email first_name
    case first_name
      when "emmanuel"
        "#{first_name}alcime54@gmail.com"
      else	
      "#{first_name}@bbunch.org"
    end  	
  end

  def get_user first_name
    User.find_by(:email=>user_email(first_name))
  end

  def users first_names
    first_names.map {|fn| get_user(fn) }
  end
  def first_names users
    users.map {|user| user.email.chomp("@bbunch.org") }
  end
  def admin_users
     @admin_users ||= users(ADMINS)
  end
  def originator_users
     @originator_users ||= users(ORIGINATORS)
  end
  def member_users
     @member_users ||= users(MEMBERS)
  end
  def boy_users
    @boy_users ||= users(BOYS)
  end
  def girl_users
    @girl_users ||= users(GIRLS)
  end
  def mike_user
    @mike_user ||= get_user("mike")
  end



 def create_business organizer, biz
    puts "creating business for #{biz[:name]}, by #{organizer.name}"
    business=Business.create(:name=>biz[:name], :address=>biz[:address],:creator_id=>organizer.id)
    organizer.add_role(Role::ORGANIZER, business).save
 end

 def create_services organizer, srv
     puts "creating service #{srv[:service_name]}, by #{organizer.name}"
	   service=Service.create(:business_id=>srv[:business_id], :service_name=>srv[:service_name],:price=>srv[:price],:description=>srv[:description],:admin_notes=>srv[:admin_notes],:creator_id=>srv[:creator_id],:priority=>srv[:priority])
	   organizer.add_role(Role::ORGANIZER, service).save
 end


 desc "reset all data"
  task reset_all: [:users,:subjects] do
  end

  desc "deletes businesses, services" 
	  task delete_subjects: :environment do
	    puts "removing #{Business.count} business "
	    puts "removing #{Service.count} services"
	    DatabaseCleaner[:active_record].clean_with(:truncation, {:except=>%w[users]})
	    DatabaseCleaner[:mongoid].clean_with(:truncation)
  end


  desc "delete all data"
  task delete_all: [:delete_subjects] do
    puts "removing #{User.count} users"
    DatabaseCleaner[:active_record].clean_with(:truncation, {:only=>%w[users]})
  end

  desc "reset users"
  task users: [:delete_all] do
    puts "creating users: #{MEMBERS}"

    MEMBERS.each_with_index do |fn,idx|
     User.create(:name  => user_name(fn),
                 :email => user_email(fn),
                 :password => "password#{idx}")
    end

    admin_users.each do |user|
      user.roles.create(:role_name=>Role::ADMIN)
    end

    originator_users.each do |user|
      user.add_role(Role::ORIGINATOR, Business).save
    end

    puts "users:#{User.pluck(:name)}"
  end

desc "reset things, images, and links" 
  task subjects: [:users] do
    puts "creating business, service,"

    business={
    :name=>"Abbott-RauT",
    :address=>"4700 Ritchie Unions"}
    organizer=get_user("alice")
    members=boy_users
    create_business organizer, business 
    service={
     	:business_id=>1,
     	:service_name=> "Lightweight Concrete Bench",
     	:price=>"89.52",
     	:description=>"Qui est id sunt corporis culpa illum. Doloremque et voluptatem deserunt sed enim quia. Adipisci debitis dolore. Aut unde consequuntur reprehenderit eius. Voluptas deleniti illo.Corporis et porro omnis expedita consequatur quo qui. Voluptates possimus esse similique cumque libero. Fuga et veniam voluptas officiis. Laudantium sit sunt voluptas. Rerum nam totam id eius et qui est.Provident ipsam doloremque et aliquam ipsum quae ut. Quia nulla id illo aut eligendi aut. Rem ut odit est.",
     	:admin_notes=>"Est aut alias qui aut eum. Optio alias quia quam. Tempore quisquam voluptas. Temporibus quos tempora corporis. Consequatur modi quos dicta qui quia quidem aliquam.Necessitatibus assumenda minus. Enim totam qui accusantium est labore. Veniam minima in. In alias saepe reiciendis est qui accusamus. Odio ut esse in cumque laborum.Officia architecto quis harum doloremque in odit. Voluptas aut et blanditiis. Sequi fuga maxime molestiae minus vero et.",
        :creator_id=>3,
	    :priority=>5
     }
   create_services organizer, service  

    business={
     :name=>"Bechtelar-Klocko",
     :address=>"67786 Tremblay Islands "
    }
    organizer=get_user("emmanuel")
    members=boy_users
    create_business organizer, business
    service={
	      :business_id=> 2,
	      :service_name=> "Small Rubber Pants",
	      :price=>"83.53",
	      :description=>"Soluta vel cupiditate sed ipsa dolor. Non dicta modi vitae debitis. Vel laborum sapiente distinctio debitis.Cupiditate laboriosam dignissimos maiores mollitia consequuntur. Ipsa facilis animi quisquam excepturi. Consequuntur doloremque ad sed rem maxime vel.Rerum iure in voluptatem repudiandae dicta. Ex atque rem est. Ut laboriosam atque rerum impedit dolor. Dolor soluta odit eos. Non quaerat quidem cupiditate saepe.",
          :admin_notes=>"In minima corporis iure eos amet. Dolor blanditiis repudiandae sapiente tenetur qui non. Omnis qui exercitationem ut. Repellendus eos amet quasi blanditiis aspernatur rem sequi.Sint tempora eaque officia esse minus veniam aut. Maiores eum a tempora natus quos. Iure est debitis sed accusantium dolor dolorem.Molestiae quaerat earum delectus quia veritatis eum omnis. Voluptas sit et corrupti. Quod eos laboriosam. Omnis voluptas vitae reprehenderit quas.",
	      :creator_id=>10,
	      :priority=>5
	    }
   
    create_services organizer,service
    business={
     :name=>"Becker and Sons",
     :address=>"199 Kertzmann Inlet"
    }
    organizer=get_user("greg")
    members=boy_users
    create_business organizer, business
    service={
	      :business_id=> 3,
	      :service_name=> "Durable Paper Computer",
	      :price=>"3.62",
	      :description=>"Ut et et nisi autem quia consequatur. Sint ex voluptas fugit quis corrupti animi distinctio. Dolorum corrupti aspernatur. Unde quasi possimus at nesciunt voluptas dolore. Id officiis dolor aliquid eligendi nam commodi sed.Qui hic maiores molestiae. Vero nostrum repudiandae rerum sit. Et magnam autem nulla. Ut pariatur reprehenderit error modi ducimus vel quisquam.Sit sit consequuntur sint animi. Vel facilis id adipisci amet est. Autem in provident. Fugit accusamus quaerat non.",
          :admin_notes=>"Qui cum non quo dignissimos dolorum et sed. Cumque et voluptates aperiam voluptatibus dignissimos. Eaque aperiam nisi. Velit unde doloremque voluptas illo.Sint tempora aspernatur et modi sequi dolores quis. Quia optio et omnis qui. Accusamus asperiores sunt dolor. Quos expedita cum neque voluptate fugit.Dolore nisi dolorem. Alias quis at fuga et qui eum quo. Distinctio quis ut ut reiciendis ut. Error voluptas exercitationem animi qui maiores.",
	      :creator_id=>4,
	      :priority=>3
	    }
  
   create_services organizer, service
   business={
     :name=>"Cronin LLC",
     :address=>"936 Ola Parks"
    }
    organizer=get_user("carol")
    members=girl_users
    create_business organizer, business
    service={
	      :business_id=> 3,
	      :service_name=> "Lightweight Aluminum Coat",
	      :price=>"20.83",
	      :description=>"Nesciunt inventore necessitatibus illo aspernatur. Magni perferendis eius quis. Quam aut in quas rem beatae. Maxime aut nobis culpa.Vero non doloribus molestiae debitis porro. Alias error voluptatum. Eum tempora ipsa. Provident iste vitae hic nemo.Natus vitae nihil. Et officiis dolores. Ut temporibus ab et aperiam dolores ullam. Praesentium sunt in et qui non velit. Rerum est ut occaecati eligendi eos.",
          :admin_notes=>"Voluptatem eligendi sed mollitia sunt nihil impedit et. Eum asperiores ut modi laboriosam minus et ut. Reprehenderit voluptatem laboriosam voluptas impedit necessitatibus cupiditate et. Doloribus ea ut eos.Similique odit vel magni non. Voluptates impedit accusamus sequi aut pariatur. Consequatur fuga omnis ex. Voluptatem totam quia porro ut. Veritatis aut doloribus quisquam necessitatibus.Nemo et ut illo voluptas. Itaque incidunt aut. Voluptatibus ut voluptatem earum quia nisi distinctio.",
	      :creator_id=>2,
	      :priority=>4
	    }
   
   create_services organizer, service
   business={
     :name=>"Crooks Inc",
     :address=>"25531 Maud Ferry"
    }
    organizer=get_user("emmanuel")
    members=girl_users
    create_business organizer, business
    service={
	      :business_id=> 4,
	      :service_name=> "Awesome Leather Knife",
	      :price=>"64.95",
	      :description=>"Odit consequatur voluptas. Voluptatem aut qui. Distinctio expedita blanditiis. Ullam dignissimos atque culpa sed qui.Facere quia est sit. Eligendi dolores tempora ipsa. Quia eos ut. Error voluptatem sit.Sunt quam eligendi doloremque sed commodi sunt. Molestiae qui aspernatur. Omnis qui nobis laudantium et. Deleniti eum libero dolor.",
          :admin_notes=>"Inventore enim officiis et expedita sequi. Ab est autem dolor voluptatem et voluptates iste. Deleniti cupiditate labore aut tempora sit soluta.Consectetur aut rerum. Perferendis consequuntur adipisci nihil. Repudiandae dignissimos eveniet omnis quas accusamus veritatis ipsum.Voluptatem ipsum nihil et maxime voluptate deserunt. Aspernatur tempore sunt qui natus voluptatem. Esse nostrum laborum impedit minus qui quia. Et dolores ratione corporis. Et laborum aliquam.",
	      :creator_id=>10,
	      :priority=>5
	    }
   
   create_services organizer, service
   business={
     :name=>"Greenfelder, Halvorson and Lockman",
     :address=>"99122 Corkery Mews"
    }
    organizer=get_user("jan")
    members=girl_users 
    create_business organizer, business
    service={
	      :business_id=> 5,
	      :service_name=> "Enormous Paper Watch",
	      :price=>"65.69",
	      :description=>"Recusandae odit laborum officia nesciunt unde neque. Laboriosam ex quia quis nihil voluptatem hic. Explicabo sed totam ut quas libero aut. Atque et quisquam. Similique culpa iste.Cum id quasi necessitatibus ab a magnam dolor. Sit suscipit libero fugiat magni aut. Ut impedit aut. Aliquid culpa aut exercitationem distinctio.Exercitationem voluptates vitae dignissimos omnis ut similique tempore. Reprehenderit sed sed laboriosam non. Est perferendis fugit qui consequatur modi quod. Voluptatem eum reprehenderit eius aliquam quis iure. Voluptas velit nulla quibusdam expedita a.",
          :admin_notes=>"Facilis at id quia. Ipsa quo eos sit omnis tenetur quis. Quasi sunt dolores illo qui dignissimos impedit debitis. Sed aliquid excepturi corrupti.Nostrum exercitationem nam quod vero quos. Veritatis ipsum sed nobis molestiae. Atque est iure sed cupiditate voluptatum alias. Ipsa blanditiis et laborum doloremque. Dolor quasi eum.Modi nisi rerum voluptas. Reiciendis laborum ab ducimus ratione fuga iste et. Et molestias odit doloremque. Quidem autem dolore ut et expedita est.",
	      :creator_id=>10,
	      :priority=>5
	    }
   
   create_services organizer, service

   business={
     :name=>"Hand, Nolan and Harris",
     :address=>"98574 Kovacek Gateway"
    }
    organizer=get_user("alice")
    members=girl_users
    create_business organizer, business
    service={
	      :business_id=> 6,
	      :service_name=> "Heavy Duty Aluminum Gloves",
	      :price=>"31.91",
	      :description=>"Ea sint et. Illum omnis quam praesentium iste laboriosam dicta quia. Quae rerum expedita sint eaque rerum dicta facere. Totam architecto assumenda facere quia expedita ipsa officia.Asperiores tempore nisi nihil dolorem quas. Ut laudantium explicabo quidem veritatis perferendis. Temporibus optio dolorum deserunt qui.Asperiores alias et. Dolores quam dolor tenetur vel ducimus. Voluptates fuga provident est doloremque et placeat. Veniam cumque et optio facilis. Voluptatum cumque enim qui id repellendus ullam ab.",
          :admin_notes=>"Reprehenderit beatae ea eligendi dolore et quia. Doloribus non et. Iste aspernatur laudantium voluptatibus. Temporibus labore ut esse exercitationem saepe voluptatibus.Ipsam laborum nesciunt voluptas maxime a. Alias incidunt eum in necessitatibus itaque. Est nisi exercitationem deleniti.Voluptatem esse et est. Nostrum qui architecto atque sapiente consequuntur. Aut eaque et doloribus magnam cum. Distinctio minima et a nobis. Ut ad omnis rerum nemo ratione.",
	      :creator_id=>10,
	      :priority=>5
	    }
      service={
        :business_id=> 6,
        :service_name=> "Fried Wings",
        :price=>"11.91",
        :description=>"Ea sint et. Illum omnis quam praesentium iste laboriosam dicta quia. Quae rerum expedita sint eaque rerum dicta facere. Totam architecto assumenda facere quia expedita ipsa officia.Asperiores tempore nisi nihil dolorem quas. Ut laudantium explicabo quidem veritatis perferendis. Temporibus optio dolorum deserunt qui.Asperiores alias et. Dolores quam dolor tenetur vel ducimus. Voluptates fuga provident est doloremque et placeat. Veniam cumque et optio facilis. Voluptatum cumque enim qui id repellendus ullam ab.",
          :admin_notes=>"Reprehenderit beatae ea eligendi dolore et quia. Doloribus non et. Iste aspernatur laudantium voluptatibus. Temporibus labore ut esse exercitationem saepe voluptatibus.Ipsam laborum nesciunt voluptas maxime a. Alias incidunt eum in necessitatibus itaque. Est nisi exercitationem deleniti.Voluptatem esse et est. Nostrum qui architecto atque sapiente consequuntur. Aut eaque et doloribus magnam cum. Distinctio minima et a nobis. Ut ad omnis rerum nemo ratione.",
        :creator_id=>10,
        :priority=>5
      }
   
   create_services organizer, service

    puts "#{Business.count} business created"
    puts "#{Service.count} service created"
  end
end

=begin
(1..20).each {|biz|
   Business.create!(:name=> Faker::Company.name, :address=> Faker::Address.street_address)
 }
=end 