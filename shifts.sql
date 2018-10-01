select * from waiters_table 
    join shift_days on shift_days.waiter_id = waiters_table.id
    join days_of_the_week on days_of_the_week.id = shift_days.days_id
where waiter_name = 'yegan' 