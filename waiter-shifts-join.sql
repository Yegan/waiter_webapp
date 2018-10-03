select 
    waiters_table.id as waiter_id,
    waiters_table.waiter_name,
    shift_days.days_id,
    days_of_week
from waiters_table 
join shift_days on waiters_table.id = shift_days.waiter_id 
join days_of_the_week on days_of_the_week.id = shift_days.days_id;  
where waiter_name = 'Yegan';
