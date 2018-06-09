

## Bamazon 

A node apllication using a MY SQL database. User has option to either act as customer, manager, and supervisor.

## Customer Mode

Customer is prompted to enter item ID# to purchase an item.
Enter the quanity desired, if quanity desired is more than available stock the program will alert low stock and restart the buying process.
![Customer Prompt](/images/customer.png)


## Manger Mode

Manager is given 4 prompt options.

![Manger Task](/images/mgrtask.png)

Display Inventory displays all of the current items in the store.

![Display Inventory](/images/mgrdisplay.png)


Low Inventory will display all items with a stock quanity less than 100.
![Display Low Inventory](/images/mgrlow.png)


Add Inventory will prompt the user to add entered quanity to entered item id.
![Add Inventory](/images/mgradd.png)


Add Product allows the user to create the a new item. User is only permitted to add items to already created departments.
![Add Product](/images/mgrcreate.png)


## Supervisor Mode

User is given two prompt options, display a table of departments or create a new department.

The display table shows department name, department cost, sales, and profit.

Department Cost is generated and updated based on the item cost times the quanity of items in that department. This field changes after items are added by a manager or purchased by a customer. The sales field is updated after customer purchases. Total profit is the difference between these two fields and is not included in the department table.

![Display Departments](/images/susdis.png)

Supervisor can create a new department. Once the department is created by a supervisor the manger can begin to create items from this department. 

![Add Department](/images/susadddpt.png)


## Tech Used
MY-SQL npm was used to grab data from the tables created.
Inquirer was used to create the prompts.
Easy Table npm was used to create clean and formatted tables to insert in the CLI.


Created By Thomas Staub 2018


