drop table if exists waiters_table, days_of_the_week, shift_days cascade;

create table waiters_table(
    id serial not null primary key,
    waiter_name text not null

);

create table days_of_the_week(
    id serial not null primary key,
    days_of_week text not null
);

create table shift_days(
    id serial not null primary key,
    days_id int not null,
    waiter_id int not null,
    foreign key (days_id) references days_of_the_week(id),
    foreign key (waiter_id) references waiters_table(id)
);

-- insert into days_of_the_week (days_of_week) values('Monday');
-- insert into days_of_the_week (days_of_week) values('Tuesday');
-- insert into days_of_the_week (days_of_week) values('Wednesday');
-- insert into days_of_the_week (days_of_week) values('Thursday');
-- insert into days_of_the_week (days_of_week) values('Friday');
-- insert into days_of_the_week (days_of_week) values('Saturday');
-- insert into days_of_the_week (days_of_week) values('Sunday');
