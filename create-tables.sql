-- Cat Shelter - 
create table if not exists cat_shelter(
    userName varchar(255) not null unique,
    pass varchar(255) not null,
    cats integer not null
);

-- Upgrades for accounts/shelters
create table if not exists upgrade(
    id serial not null unique,
    name varchar(255) not null,
    strength integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    mechanic varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(userName)
        on delete cascade
);

-- Buildings for accounts/shelters
create table if not exists building(
    id serial not null unique,
    name varchar(255) not null,
    efficiency integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    mechanic varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(userName)
        on delete cascade
);

create table if not exists upgrade_inventory(
    name varchar(255) not null unique,
    mechanic varchar(255) not null,
    price integer not null,
    descriptor varchar(255),
    strength integer not null
);

create table if not exists building_inventory(
    name varchar(255) not null unique,
    mechanic varchar(255) not null,
    price integer not null,
    descriptor varchar(255),
    strength integer not null
);

-- 2 original upgrades
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+3/click','add', 20, 'adds +3 to each click', 3) on conflict do nothing;
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('x2/click', 'mult', 400, 'multiplies current click power by 2', 2) on conflict do nothing;

-- 5 new purchasable upgrades
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+10/click','add', 80, 'adds +10 to each click', 10) on conflict do nothing;
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+50/click','add', 500, 'adds +50 to each click', 50) on conflict do nothing;
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+100/click','add', 800, 'adds +100 to each click', 100) on conflict do nothing;
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+150/click','add', 1000, 'adds +150 to each click', 150) on conflict do nothing;
insert into upgrade_inventory(name, mechanic, price, descriptor, strength) values('+200/click','add', 1100, 'adds +200 to each click', 200) on conflict do nothing;

-- 2 original buildings
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+3/second', 'secondhand', 100, 'passively collects 3 cats per second', 3) on conflict do nothing;
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+10/second','luxurious', 200, 'passively collects 10 cats per second', 10) on conflict do nothing;

-- 5 new purchasable buildings
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+5/second','secondhand', 150, 'passively collects 5 cats per second', 5) on conflict do nothing;
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+7/second','secondhand', 200, 'passively collects 7 cats per second', 7) on conflict do nothing;
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+20/second','luxurious', 400, 'passively collects 20 cats per second', 20) on conflict do nothing;
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+100/second','luxurious', 1000, 'passively collects 100 cats per second', 100) on conflict do nothing;
insert into building_inventory(name, mechanic, price, descriptor, strength) values('+400/second','luxurious', 3000, 'passively collects 400 cats per second', 400) on conflict do nothing;