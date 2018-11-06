Feature: Manage a Users Addresses
  In order to make create an order on the platform
  A user should be able to 
  Create, Delete, Update and Retrieve multiple addresses 

  Scenario: I attempt to create an Address
    Given I am have an account on the platform
      And and I am logged in
      When I enter the following details
        | firstname | lastname | company | line1 | line2 | city | state | country | postcode | type |  latitude | longitude | landmark | 
        | james | cameron | Uber | 12 Ayo Jagun | Off Abike Animasawun | Lekki Phase 1 | Lagos | Nigeria | NA | Home |  0.0 | 0.1 | Soundcity Street | 
      And the my customerId '<customerId>'
     Then I should get a success message with a response with a valid numeric id   
  
  Scenario: I attempt to create an Address without entering any details
    Given I am have an account on the platform
      And and I am logged in
      When I enter the following details
        | firstname | lastname | company | line1 | line2 | city | state | country | postcode | type |  latitude | longitude | landmark | 
        |  |  |  |  |  |  |  |  |  |  |  |  |  | 
      And the my customerId '<customerId>'
     Then I should get an error response stating that an empty address cannot be created
  
  Scenario: I attempt to create an Address without entering the required details
    Given I am have an account on the platform
      And and I am logged in
      When I enter the following details
        | firstname | lastname | company | line1 | line2 | city | state | country | postcode | type |  latitude | longitude | landmark | 
        | james | cameron | Uber |  | Off Abike Animasawun |  |  |  | NA |  |  0.0 | 0.1 | Souncity Street | 
      And the my customerId '<customerId>'
     Then I should get an error response stating that the list of missing fields   
  
  Scenario: I attempt to create an Address without specifying a User
    Given I am have an account on the platform
      And and I am logged in
      When I enter the following details
        | firstname | lastname | company | line1 | line2 | city | state | country | postcode | type |  latitude | longitude | landmark | 
        | james | cameron | Uber | 12 Ayo Jagun | Off Abike Animasawun | Lekki Phase 1 | Lagos | Nigeria | NA | Home |  0.0 | 0.1 | Soundcity Street | 
     Then I should get a response with a response with a valid numeric id   
  
  Scenario: I attempt to retreive a Users Addresses
    Given I am a user of the module
     When I click Buy Now
     Then I should see an error screen asking me to enter the details of the item i want to pay for
  
  Scenario: I attempt to update a Users Addresses
    Given I am a user of the module
     When I click Buy Now
     Then I should see an error screen asking me to enter the details of the item i want to pay for
  
  Scenario: I attempt to delete a Users Addresses
    Given I am a user of the module
     When I click Buy Now
     Then I should see an error screen asking me to enter the details of the item i want to pay for
  