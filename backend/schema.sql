--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2026-03-01 19:32:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 41030)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 41077)
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    language_name character varying(100) NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41076)
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.languages_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 223
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- TOC entry 226 (class 1259 OID 41086)
-- Name: learning_goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.learning_goals (
    id integer NOT NULL,
    goal_name character varying(100) NOT NULL
);


ALTER TABLE public.learning_goals OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41085)
-- Name: learning_goals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.learning_goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.learning_goals_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 225
-- Name: learning_goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.learning_goals_id_seq OWNED BY public.learning_goals.id;


--
-- TOC entry 219 (class 1259 OID 32996)
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 32995)
-- Name: levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.levels_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 218
-- Name: levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.levels_id_seq OWNED BY public.levels.id;


--
-- TOC entry 230 (class 1259 OID 41123)
-- Name: practice_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practice_sessions (
    id integer NOT NULL,
    user_id uuid,
    word_id integer,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed boolean DEFAULT false
);


ALTER TABLE public.practice_sessions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 41122)
-- Name: practice_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practice_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practice_sessions_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 229
-- Name: practice_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practice_sessions_id_seq OWNED BY public.practice_sessions.id;


--
-- TOC entry 231 (class 1259 OID 41141)
-- Name: recorded_audio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recorded_audio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id integer,
    user_id uuid,
    word_id integer,
    audio_s3_url text NOT NULL,
    pronunciation_score integer,
    feedback text,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recorded_audio OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 41095)
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    user_id uuid,
    language_id integer,
    goal_id integer,
    level_id integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 41094)
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_preferences_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- TOC entry 222 (class 1259 OID 41067)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    age integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33027)
-- Name: words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.words (
    id integer NOT NULL,
    text character varying(255) NOT NULL,
    level_id integer,
    language character varying(50) DEFAULT 'english'::character varying,
    audio_s3_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.words OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 33026)
-- Name: words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.words_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 220
-- Name: words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.words_id_seq OWNED BY public.words.id;


--
-- TOC entry 4818 (class 2604 OID 41080)
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- TOC entry 4819 (class 2604 OID 41089)
-- Name: learning_goals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_goals ALTER COLUMN id SET DEFAULT nextval('public.learning_goals_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 32999)
-- Name: levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels ALTER COLUMN id SET DEFAULT nextval('public.levels_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 41126)
-- Name: practice_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice_sessions ALTER COLUMN id SET DEFAULT nextval('public.practice_sessions_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 41098)
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 33030)
-- Name: words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);


--
-- TOC entry 4838 (class 2606 OID 41084)
-- Name: languages languages_language_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_language_name_key UNIQUE (language_name);


--
-- TOC entry 4840 (class 2606 OID 41082)
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 41093)
-- Name: learning_goals learning_goals_goal_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_goals
    ADD CONSTRAINT learning_goals_goal_name_key UNIQUE (goal_name);


--
-- TOC entry 4844 (class 2606 OID 41091)
-- Name: learning_goals learning_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learning_goals
    ADD CONSTRAINT learning_goals_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 33003)
-- Name: levels levels_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_name_key UNIQUE (name);


--
-- TOC entry 4830 (class 2606 OID 33001)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 41130)
-- Name: practice_sessions practice_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 41149)
-- Name: recorded_audio recorded_audio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recorded_audio
    ADD CONSTRAINT recorded_audio_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 41101)
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 41075)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4836 (class 2606 OID 41073)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);


--
-- TOC entry 4832 (class 2606 OID 33036)
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 41131)
-- Name: practice_sessions practice_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(uuid) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 41136)
-- Name: practice_sessions practice_sessions_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice_sessions
    ADD CONSTRAINT practice_sessions_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id) ON DELETE CASCADE;


--
-- TOC entry 4858 (class 2606 OID 41150)
-- Name: recorded_audio recorded_audio_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recorded_audio
    ADD CONSTRAINT recorded_audio_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 41155)
-- Name: recorded_audio recorded_audio_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recorded_audio
    ADD CONSTRAINT recorded_audio_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(uuid) ON DELETE CASCADE;


--
-- TOC entry 4860 (class 2606 OID 41160)
-- Name: recorded_audio recorded_audio_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recorded_audio
    ADD CONSTRAINT recorded_audio_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id);


--
-- TOC entry 4852 (class 2606 OID 41112)
-- Name: user_preferences user_preferences_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.learning_goals(id);


--
-- TOC entry 4853 (class 2606 OID 41107)
-- Name: user_preferences user_preferences_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- TOC entry 4854 (class 2606 OID 41117)
-- Name: user_preferences user_preferences_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id);


--
-- TOC entry 4855 (class 2606 OID 41102)
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(uuid) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 33037)
-- Name: words words_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id) ON DELETE CASCADE;


-- Completed on 2026-03-01 19:32:27

--
-- PostgreSQL database dump complete
--

