-- Cat Shelter - 
create table if not exists cat_shelter(
    userName varchar(255) not null unique,
    pass varchar(255) not null,
    cats integer not null
);

-- Upgrades for accounts/shelters
create table if not exists upgrade(
    id serial not null unique,
    strength integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    upgradeType varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(userName)
        on delete cascade
);

-- Buildings for accounts/shelters
create table if not exists building(
    id serial not null unique,
    efficiency integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    buildingType varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(userName)
        on delete cascade
);

create table if not exists upgrade_inventory(
    mechanic varchar(255) not null unique,
    price integer not null,
    descriptor varchar(255),
    strength integer not null
);

create table if not exists building_inventory(
    mechanic varchar(255) not null unique,
    price integer not null,
    descriptor varchar(255),
    strength integer not null
);

insert into upgrade_inventory(mechanic, price, descriptor, strength) values('add', 20, 'adds +3 to each click', 3) on conflict do nothing;
insert into upgrade_inventory(mechanic, price, descriptor, strength) values('mult', 400, 'multiplies current click power by 2', 2) on conflict do nothing;
insert into building_inventory(mechanic, price, descriptor, strength) values('secondhand', 100, 'passively collects 3 cats per second', 3) on conflict do nothing;
insert into building_inventory(mechanic, price, descriptor, strength) values('luxurious', 200, 'passively collects 10 cats per second', 10) on conflict do nothing;