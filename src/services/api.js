import axios from 'axios';

const API_URL = 'http://192.168.2.122:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const GOAL_MAP = {
  muscle_gain: 'GANHAR_MASSA',
  maintenance: 'MANTER_PESO',
  fat_loss: 'PERDER_GORDURA',
};

const SEX_MAP = {
  M: 'MASCULINO',
  F: 'FEMININO',
};

const ACTIVITY_MAP = {
  sedentary: 'SEDENTARIO',
  lightly_active: 'LEVEMENTE_ATIVO',
  moderately_active: 'MODERADAMENTE_ATIVO',
  very_active: 'MUITO_ATIVO',
  extremely_active: 'ATLETA',
};

const EXPERIENCE_MAP = {
  beginner: 'INICIANTE',
  intermediate: 'INTERMEDIARIO',
  advanced: 'AVANCADO',
};

const DIET_MAP = {
  homemade: 'COMIDA_CASEIRA',
  practical: 'PRATICA_E_RAPIDA',
  strict: 'DIETA_RESTRITIVA',
  flexible: 'FLEXIVEL',
};

const PHYSICAL_RESTRICTION_MAP = {
  herniated_disc: 'HERNIA_DE_DISCO',
  knee_injury: 'LESAO_JOELHO',
  shoulder_injury: 'LESAO_OMBRO',
  lower_back_pain: 'DOR_LOMBAR',
  tendinitis: 'TENDINITE',
  wrist_injury: 'LESAO_PUNHO',
};

const DIETARY_RESTRICTION_MAP = {
  lactose_intolerant: 'INTOLERANCIA_LACTOSE',
  gluten_free: 'ALERGIA_A_GLUTEN',
  vegan: 'VEGANO',
  vegetarian: 'VEGETARIANO',
  seafood_allergy: 'ALERGIA_FRUTOS_MAR',
  peanut_allergy: 'ALERGIA_AMENDOIM',
};

function cleanString(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function parseOptionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatDateOnly(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return value.toISOString().slice(0, 10);
}

export function buildUserPayload(onboardingData, email, senha) {
  const physicalRestrictions = (onboardingData.physicalRestrictions || [])
    .filter((v) => v !== 'none' && v !== 'other')
    .map((v) => PHYSICAL_RESTRICTION_MAP[v])
    .filter(Boolean);

  const customPhysical = cleanString(onboardingData.physicalRestrictionsOther);
  if (customPhysical) {
    physicalRestrictions.push(customPhysical);
  }

  const dietaryRestrictions = (onboardingData.dietaryRestrictions || [])
    .filter((v) => v !== 'none' && v !== 'other')
    .map((v) => DIETARY_RESTRICTION_MAP[v])
    .filter(Boolean);

  const customDietary = cleanString(onboardingData.dietaryRestrictionsOther);
  if (customDietary) {
    dietaryRestrictions.push(customDietary);
  }

  const excludedFoods = (onboardingData.excludedFoods || [])
    .filter((v) => v !== 'none' && v !== 'other');

  const customExcludedFoods = cleanString(onboardingData.excludedFoodsOther);
  if (customExcludedFoods) {
    excludedFoods.push(customExcludedFoods);
  }

  const payload = {
    nome: cleanString(onboardingData.name),
    email,
    senha,
    objetivo: GOAL_MAP[onboardingData.goal] || null,
    sexo: SEX_MAP[onboardingData.biologicalSex] || null,
    altura: parseOptionalNumber(onboardingData.height),
    peso: parseOptionalNumber(onboardingData.weight),
    dataNascimento: formatDateOnly(onboardingData.birthDate),
    gorduraCorporal: parseOptionalNumber(onboardingData.bodyFatPercentage),
    nivelDeAtividade: ACTIVITY_MAP[onboardingData.activityLevel] || null,
    experienciaComTreino: EXPERIENCE_MAP[onboardingData.experienceLevel] || null,
    quantidadeDiasTreino: parseOptionalNumber(onboardingData.trainingDaysPerWeek),
    estiloDieta: DIET_MAP[onboardingData.dietStyle] || null,
  };

  if (dietaryRestrictions.length > 0) {
    payload.restricoesAlimentares = dietaryRestrictions;
  }
  if (physicalRestrictions.length > 0) {
    payload.restricoesFisicas = physicalRestrictions;
  }
  if (excludedFoods.length > 0) {
    payload.alimentosQueNaoCome = excludedFoods;
  }

  return payload;
}

export async function createUser(payload) {
  const response = await api.post('/user', payload);
  return response.data;
}

export async function loginUser(email, senha) {
  const response = await api.post('/user/login', { email, senha });
  return response.data;
}

export default api;
