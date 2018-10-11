select days_of_the_week.id, days_of_the_week.days_of_week, waiters_table.id, waiters_table.waiter_name
from days_of_the_week
left join shift_days on shift_days.days_id = days_of_the_week.id
left join waiters_table on waiters_table.id = shift_days.waiter_id;