# StockOrderExecutionSystem

**Problem:** A stock order is an order to buy/sell a given quantity of stocks of speciﬁed company. Person willing to buy or sell a stock will submit an order to a stock exchange, where it is executed against the opposite side order of same company i.e, buy order is executed against an existing sell order and vice-versa. The criteria for stock orders execution is that, they should belong to same company, they are opposite sides ( Buy vs Sell), and order of arrival i.e, the order is executed against the ﬁrst available order. The left over quantity after execution is called remaining quantity. For example, if a buy order of quantity 10 is executed against a sell order of quantity 5, the remaining quantity of buy and sell orders are 5 and 0 respectively. An order status is called OPEN if the remaining quantity is greater than zero(>0), otherwise it’s called CLOSED(i.e., remaining quantity = 0). This project takes input orders from a CSV file, processes them and prints the status, remaining quantity of all the orders as output.

**Sample Input:**
| STOCK ID | SIDE | COMPANY | QUANTITY |
|----------|------|---------|----------|
| 1 | Buy | ABC | 10 |
| 2 | Sell | XYZ | 15 |
| 3 | Sell | ABC | 13 |
| 4 | Buy | XYZ | 10 |
| 5 | Buy | XYZ | 8 |

**Expected Output:**
| STOCK ID | SIDE | COMPANY | QUANTITY | REMAINING QUANTITY | STATUS |
|----------|------|---------|----------|--------------------|--------|
| 1 | Buy | ABC | 10 | 0 | CLOSED |
| 2 | Sell | XYZ | 15 | 0 | CLOSED |
| 3 | Sell | ABC | 13 | 3 | OPEN |
| 4 | Buy | XYZ | 10 | 0 | CLOSED |
| 5 | Buy | XYZ | 8 | 3 | OPEN |
