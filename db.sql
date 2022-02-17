-- Table: message

-- DROP TABLE message;

CREATE TABLE message
(
  id serial NOT NULL,
  from_user_id character varying(45) DEFAULT NULL::character varying,
  to_user_id character varying(45) DEFAULT NULL::character varying,
  message character varying(200) DEFAULT NULL::character varying,
  CONSTRAINT message_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE message
  OWNER TO postgres;


-- Table: users

-- DROP TABLE users;

CREATE TABLE users
(
  id serial NOT NULL,
  username character varying(20) NOT NULL,
  password character varying(20) NOT NULL,
  online character varying(2) NOT NULL,
  socketid character varying(20) DEFAULT NULL::character varying,
  CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;
