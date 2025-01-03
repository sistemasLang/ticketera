--####Reseteamos para inicializar todo
DROP SCHEMA IF EXISTS supports CASCADE;
DROP TABLE IF EXISTS public.platform CASCADE;
DROP SCHEMA IF EXISTS clients CASCADE;
DROP SCHEMA IF EXISTS users CASCADE;
DROP SCHEMA IF EXISTS util CASCADE;

CREATE SCHEMA IF NOT EXISTS util;

create or replace function util.formatear_timestamp(ptimestamp timestamp without time zone) returns text
    language plpgsql
as
$$
BEGIN

  return to_char(pTimestamp::timestamp with time zone, 'DD/MM/YYYY HH24:MI'::text);

  END;

$$;

create or replace function util.bool_a_si_no(valor_booleano boolean) returns text
    language plpgsql
as
$$
BEGIN
  IF valor_booleano THEN
    RETURN 'Si';
  ELSE
    RETURN 'No';
  END IF;
END;
$$;

create or replace function util.formatear_apellido_nombre(papellido character varying, pnombre character varying) returns text
    language plpgsql
as
$$
BEGIN

  return  COALESCE((papellido::text || ', '::text) || pnombre::text, 'S/Apellido y Nombre'::text) ;

  END;

$$;


-- ##########CREAMOS SCHEMA USERS#############
CREATE SCHEMA IF NOT EXISTS users;

-- Tabla del usuario, estos van a ser los usuarios encargados de manejar el ticket
CREATE TABLE users.user (
    id_user serial not null,
    vuser varchar(100) not null,
    vpassword varchar(250) not null,
    vname varchar(150) not null,
    vlastname varchar(150) not null,
    tscreated timestamp default now(),
    benabled boolean default true,
    vemail varchar(150) not null
);

alter table users.user ADD CONSTRAINT pk_id_user PRIMARY KEY (id_user);

--##############incorporamos extenciones para poder hashear la contraseña########
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--##########FUNCIONES Y TRIGGER DE HASHEO DE CONTRASEÑA

CREATE OR REPLACE FUNCTION users.fnc_i_b_hash_user()
RETURNS TRIGGER AS $$
BEGIN

  IF new.vpassword IS NOT NULL THEN
    new.vpassword := crypt(new.vpassword, gen_salt('bf'));
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_iu_usuario_hasheo
BEFORE INSERT OR UPDATE OF vpassword
ON users.user
FOR EACH ROW
EXECUTE FUNCTION users.fnc_i_b_hash_user();

INSERT INTO users.user (vuser, vpassword, vname, vlastname, vemail) VALUES ('mariano', 'Mariano123', 'Mariano Agustin', 'Mayo Santillan', 'marianoagustinmayo@gmail.com');

CREATE TABLE public.platform (
    id_platform serial not null,
    vplatform varchar(100),
    benable boolean default true
);

ALTER TABLE public.platform ADD CONSTRAINT pk_platform PRIMARY KEY (id_platform);

INSERT INTO public.platform (vplatform) VALUES ('Popey-ERP');


--##CREACION DE ESQUEMA CLIENTE

CREATE SCHEMA clients;

-- ######## CREAMOS LA TABLA CLIENTE, EN EL CUAL ACA MISMO VAMOS UN USUARIO VA A TENER QUE CREAR EL CLIENTE, Y EL SISTEMA LE VA A DEVOLVER EL VAUTHCLIENT Y EL VSECRET
CREATE TABLE clients.client (
    id_client serial not null,
    vauthclient varchar(250) not null,
    vsecret varchar(250) not null,
    vclient varchar(150) not null,
    vweb varchar(150) not null,
    benable boolean default true
);

ALTER TABLE clients.client ADD CONSTRAINT pk_clientsidclient PRIMARY KEY (id_client);

-- ##### CREACION DE FUNCION  Y TRIGGER PARA HASHEO DE VSECRET
CREATE OR REPLACE FUNCTION clients.fnc_i_b_hash_client()
RETURNS TRIGGER AS $$
BEGIN

  IF new.vsecret IS NOT NULL THEN
    new.vsecret := crypt(new.vsecret, gen_salt('bf'));
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_iu_cliente_hasheo
BEFORE INSERT OR UPDATE OF vsecret
ON clients.client
FOR EACH ROW
EXECUTE FUNCTION clients.fnc_i_b_hash_client();


CREATE TABLE clients.client_platform(
    id_clientplatform serial not null,
    id_client integer not null,
    id_platform integer not null
);

alter table clients.client_platform ADD CONSTRAINT pk_idclientplatform PRIMARY KEY (id_clientplatform);
alter table clients.client_platform ADD CONSTRAINT fkclientplatform_client FOREIGN KEY  (id_client) references clients.client(id_client);
alter table clients.client_platform ADD CONSTRAINT fkclientplatform_platform FOREIGN KEY  (id_platform) references public.platform(id_platform);



-- ####### CREACION DE ESQUEMA SOPORTE
CREATE SCHEMA supports;


---- ##### TABLA DE ESTADO DE SOPORTE, EN LA CUAL SE IDENTIFICA LOS ESTADOS, INICIALMENTE EL SOPORTE COMIENZA CON UN ESTADO EN BACKLOG
CREATE TABLE supports.state (
    id_state serial not null,
    vstate varchar (250)
);

ALTER TABLE supports.state ADD CONSTRAINT pk_state PRIMARY KEY (id_state);

INSERT INTO supports.state (vstate) values ('Backlog');
INSERT INTO supports.state (vstate) values ('En proceso');
INSERT INTO supports.state (vstate) values ('Finalizado');

CREATE TABLE supports.priority_support (
    id_prioritysupport serial not null,
    vpriority varchar (250)
);

ALTER TABLE supports.priority_support ADD CONSTRAINT pk_prioritysupport PRIMARY KEY (id_prioritysupport);

INSERT INTO supports.priority_support (vpriority) values ('Baja');
INSERT INTO supports.priority_support (vpriority) values ('Media');
INSERT INTO supports.priority_support (vpriority) values ('Alta');
INSERT INTO supports.priority_support (vpriority) values ('Urgente');



-- ########## TABLA EN LA CUAL VA A ESTAR INCORPORADO TODOS LOS SOPORTES QUE MANDEN LOS CLIENTES
CREATE TABLE supports.support(
    id_support serial not null,
    id_client integer not null,
    vtitle varchar(250) not null,
    tdescription text not null,
    tscreado timestamp default now(),
    id_state integer not null default 1,
    id_user integer,
    id_prioridad integer
);

ALTER TABLE supports.support ADD CONSTRAINT pk_idsupport PRIMARY KEY (id_support);
ALTER TABLE supports.support ADD CONSTRAINT fk_support_client FOREIGN KEY (id_client) REFERENCES clients.client(id_client);
ALTER TABLE supports.support ADD CONSTRAINT fk_id_state FOREIGN KEY (id_state) REFERENCES supports.state(id_state);
ALTER TABLE supports.support ADD CONSTRAINT fk_id_user FOREIGN KEY (id_user) REFERENCES users.user(id_user);
ALTER TABLE supports.support ADD CONSTRAINT fk_id_priority FOREIGN KEY (id_prioridad) REFERENCES supports.priority_support(id_prioritysupport);



CREATE TABLE supports.comment (
    id_comment serial not null,
    id_support integer not null,
    tscreado timestamp default now(),
    vcomment text not null,
    id_user integer
);

ALTER TABLE supports.comment ADD CONSTRAINT pk_idcomment PRIMARY KEY (id_comment);
ALTER TABLE supports.comment ADD CONSTRAINT fk_idsupport FOREIGN KEY (id_support) REFERENCES supports.support(id_support);
ALTER TABLE supports.comment ADD CONSTRAINT fk_iduser FOREIGN KEY (id_user) REFERENCES users.user(id_user);


CREATE TABLE supports.image_support (
    id_imagensupport serial  NOT NULL,
    vpath varchar(250)  NULL,
    tscreado timestamp  NULL,
    id_support int,
    id_comment int
);


ALTER TABLE supports.image_support ADD CONSTRAINT pk_idimagensupport PRIMARY KEY (id_imagensupport);
ALTER TABLE supports.image_support ADD CONSTRAINT fk_imgsupport_support FOREIGN KEY (id_support) REFERENCES supports.support(id_support);
ALTER TABLE supports.image_support ADD CONSTRAINT fk_imgsupport_comment FOREIGN KEY (id_comment) REFERENCES supports.comment(id_comment);

CREATE OR REPLACE VIEW users.view_user
as
select u.id_user,
       u.vuser,
       u.vpassword,
       u.vname,
       u.vlastname,
       util.formatear_apellido_nombre(u.vlastname, u.vname)     as vusuario,
       util.formatear_timestamp(u.tscreated)        as dcreated,
       u.tscreated,
       u.benabled,
       util.bool_a_si_no(u.benabled)                as vhabilitado,
       u.vemail
from users.user u;


CREATE OR REPLACE VIEW clients.view_client
as
    select c.id_client,
           c.vclient,
           c.vweb,
           c.benable,
          util.bool_a_si_no(c.benable)                as vhabilitado
from clients.client c;


CREATE OR REPLACE VIEW supports.view_support
as
    select s.id_support,
           s.id_client,
           s.vtitle,
           s.tdescription,
           s.id_user,
           s.id_prioridad,
           s.id_state,
           s.tscreado,
           util.formatear_timestamp(s.tscreado)                            as dcreado,
           c.vclient,
           c.vweb,
           util.formatear_apellido_nombre(u.vlastname, u.vname)     as vusuario,
           ps.vpriority,
           st.vstate
from supports.support s
    join clients.client c on s.id_client = c.id_client
    join supports.state st on st.id_state = s.id_state
    left join users.user u on s.id_user = u.id_user
    left join supports.priority_support ps on ps.id_prioritysupport = s.id_prioridad;



CREATE OR REPLACE VIEW supports.view_comment
as
    select c.id_comment,
           c.id_support,
           c.tscreado,
           util.formatear_timestamp(c.tscreado)                             as dcreado,
           c.vcomment,
           c.id_user,
           case when c.id_user is null then false else true end                       as isuser,
           util.formatear_apellido_nombre(u.vlastname, u.vname)     as vusuario,
           cl.vclient,
           cl.vweb
from supports.comment c
join supports.support s on s.id_support = c.id_support
join clients.client cl on cl.id_client = s.id_client
left join users.user u on u.id_user = c.id_user;
