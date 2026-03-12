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
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(userName)
        on delete cascade
);
