
CREATE TYPE public.app_role AS ENUM ('participant', 'company', 'anima_team');
CREATE TYPE public.vinculo_anima AS ENUM ('egresado_academia','egresado_finest','egresado_bachillerato','sin_vinculo');
CREATE TYPE public.situacion_laboral AS ENUM ('sin_empleo','empleo_informal','empleo_formal_mejorar','empleo_formal_satisfactorio');
CREATE TYPE public.etapa_acompanamiento AS ENUM ('sin_contactar','en_seguimiento','con_plan','insertado','cerrado');
CREATE TYPE public.inscripcion_status AS ENUM ('pendiente','aprobada','rechazada');
CREATE TYPE public.modalidad AS ENUM ('presencial','virtual','hibrida');
CREATE TYPE public.taller_estado AS ENUM ('inscripto','en_curso','completado');
CREATE TYPE public.oportunidad_status AS ENUM ('activa','pausada','cerrada');
CREATE TYPE public.postulacion_estado AS ENUM ('enviada','en_revision','entrevista','seleccionado','no_avanza');

-- Tables first
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT, phone TEXT, birth_date DATE, email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
CREATE TABLE public.participant_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  vinculo vinculo_anima, situacion situacion_laboral,
  area_interes TEXT, formacion TEXT, experiencia TEXT,
  competencias_tecnicas TEXT, competencias_transversales TEXT,
  cv_url TEXT, linkedin_url TEXT,
  etapa etapa_acompanamiento NOT NULL DEFAULT 'sin_contactar',
  notas_internas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL, birth_date DATE NOT NULL,
  vinculo vinculo_anima NOT NULL, situacion situacion_laboral NOT NULL,
  area_interes TEXT, talleres_interes TEXT[] DEFAULT '{}',
  phone TEXT, email TEXT NOT NULL, consent BOOLEAN NOT NULL DEFAULT false,
  status inscripcion_status NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.encuestas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT, inscripcion_id UUID REFERENCES public.inscripciones(id) ON DELETE SET NULL,
  nivel_digital INT CHECK (nivel_digital BETWEEN 1 AND 5),
  fortalezas TEXT[] DEFAULT '{}', mejorar TEXT[] DEFAULT '{}',
  tiene_linkedin TEXT, tiene_cv TEXT, experiencia_previa BOOLEAN,
  expectativas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  nombre TEXT NOT NULL, rubro TEXT, descripcion TEXT,
  contacto TEXT, sitio_web TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.talleres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL, tematicas TEXT, profesional TEXT,
  modalidad modalidad NOT NULL DEFAULT 'hibrida',
  carga_horaria INT NOT NULL DEFAULT 6,
  descripcion TEXT, materiales_url TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.taller_inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taller_id UUID NOT NULL REFERENCES public.talleres(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  estado taller_estado NOT NULL DEFAULT 'inscripto',
  horas_completadas INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (taller_id, user_id)
);
CREATE TABLE public.oportunidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL, descripcion TEXT, requisitos TEXT,
  area TEXT, modalidad modalidad, nivel_experiencia TEXT,
  remuneracion TEXT, fecha_limite DATE,
  status oportunidad_status NOT NULL DEFAULT 'activa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.postulaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oportunidad_id UUID NOT NULL REFERENCES public.oportunidades(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  estado postulacion_estado NOT NULL DEFAULT 'enviada',
  mensaje TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (oportunidad_id, user_id)
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.participant_profiles TO authenticated;
GRANT INSERT ON public.inscripciones TO anon, authenticated;
GRANT SELECT, UPDATE ON public.inscripciones TO authenticated;
GRANT INSERT ON public.encuestas TO anon, authenticated;
GRANT SELECT ON public.encuestas TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.empresas TO authenticated;
GRANT SELECT ON public.talleres TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.talleres TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taller_inscripciones TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oportunidades TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.postulaciones TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talleres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taller_inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulaciones ENABLE ROW LEVEL SECURITY;

-- Security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'participant') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.tg_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_uat BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER pp_uat BEFORE UPDATE ON public.participant_profiles FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER empresas_uat BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER post_uat BEFORE UPDATE ON public.postulaciones FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Policies
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "pp read" ON public.participant_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team')
    OR EXISTS (
      SELECT 1 FROM public.postulaciones p
      JOIN public.oportunidades o ON o.id = p.oportunidad_id
      JOIN public.empresas e ON e.id = o.empresa_id
      WHERE p.user_id = participant_profiles.user_id AND e.user_id = auth.uid()
    ));
CREATE POLICY "pp insert self" ON public.participant_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "pp update" ON public.participant_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "ins public insert" ON public.inscripciones FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "ins team read" ON public.inscripciones FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "ins team update" ON public.inscripciones FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "enc public insert" ON public.encuestas FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "enc team read" ON public.encuestas FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "emp read auth" ON public.empresas FOR SELECT TO authenticated USING (true);
CREATE POLICY "emp self insert" ON public.empresas FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'company'));
CREATE POLICY "emp update" ON public.empresas FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "tal public read" ON public.talleres FOR SELECT TO anon, authenticated USING (activo OR public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "tal team all" ON public.talleres FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'anima_team')) WITH CHECK (public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "ti read" ON public.taller_inscripciones FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "ti insert self" ON public.taller_inscripciones FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ti update team" ON public.taller_inscripciones FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "ti delete self" ON public.taller_inscripciones FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "op read" ON public.oportunidades FOR SELECT TO authenticated USING (
  status = 'activa' OR public.has_role(auth.uid(),'anima_team') OR
  EXISTS (SELECT 1 FROM public.empresas e WHERE e.id = empresa_id AND e.user_id = auth.uid()));
CREATE POLICY "op insert" ON public.oportunidades FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.empresas e WHERE e.id = empresa_id AND e.user_id = auth.uid()));
CREATE POLICY "op update" ON public.oportunidades FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.empresas e WHERE e.id = empresa_id AND e.user_id = auth.uid()) OR public.has_role(auth.uid(),'anima_team'));
CREATE POLICY "op delete" ON public.oportunidades FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.empresas e WHERE e.id = empresa_id AND e.user_id = auth.uid()) OR public.has_role(auth.uid(),'anima_team'));

CREATE POLICY "post read" ON public.postulaciones FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'anima_team')
    OR EXISTS (SELECT 1 FROM public.oportunidades o JOIN public.empresas e ON e.id = o.empresa_id
               WHERE o.id = oportunidad_id AND e.user_id = auth.uid()));
CREATE POLICY "post insert self" ON public.postulaciones FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'participant'));
CREATE POLICY "post update" ON public.postulaciones FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.oportunidades o JOIN public.empresas e ON e.id = o.empresa_id
                 WHERE o.id = oportunidad_id AND e.user_id = auth.uid())
    OR public.has_role(auth.uid(),'anima_team'));

-- Seed talleres
INSERT INTO public.talleres (nombre, tematicas, profesional, modalidad, carga_horaria, descripcion) VALUES
('Enfoque STEM, IA, Big Data y Desarrollo Web','IA, Big Data, desarrollo web, soporte técnico, tendencias globales','Técnico/a en Tecnología','hibrida',8,'Una introducción profesional al mundo tecnológico actual y sus tendencias.'),
('Reclutamiento, selección y software para empleo','Software aplicado, ofertas laborales, procesos de selección','Experto/a de Gestión Humana en Tecnología','hibrida',6,'Aprendé cómo funcionan los procesos de selección y cómo destacar en ellos.'),
('Emprendedurismo + Finanzas profesionales y personales','Educación financiera, emprendedurismo, planificación','Responsable de Gestión Humana','hibrida',6,'Tomá las riendas de tus finanzas y descubrí el costado emprendedor.'),
('Inglés para tecnológicos','Inglés técnico, vocabulario IT, comunicación profesional','Docente en Inglés y Tecnología','hibrida',6,'Inglés orientado al mundo tech: vocabulario y comunicación.'),
('Tecnología y salud mental','Bienestar digital, balance, hábitos saludables','Profesional de Psicología','hibrida',4,'Cómo cuidarte en un mundo siempre conectado.'),
('Competencias transversales para el trabajo','Comunicación, trabajo en equipo, gestión del tiempo, resiliencia','Equipo Técnico de ÁNIMA','hibrida',6,'Las habilidades que toda empresa busca, más allá del puesto.');
