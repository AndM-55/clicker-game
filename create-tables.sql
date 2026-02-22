create table if not exists profile_select(
    id serial not null unique
);

create table if not exists cat_shelter(
    id serial not null unique,
    cats integer not null,
    shelter_owner varchar(255) not null unique,
    parent_profile integer not null,
    foreign key (parent_profile) references profile_select(id)
        on delete cascade
);

create table if not exists upgrade(
    id serial not null unique,
    strength integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(shelter_owner)
        on delete cascade
);

create table if not exists building(
    id serial not null unique,
    efficiency integer not null,
    price integer not null,
    descriptor varchar(255) not null,
    shelter varchar(255) not null,
    foreign key (shelter) references cat_shelter(shelter_owner)
        on delete cascade
);
