import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Futuramente virá do .env

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pra adicionar token futuramente
api.interceptors.request.use((config) => {
  // TODO: Pegar token do AsyncStorage e adicionar ao header
  // const token = await AsyncStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor pra tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Tratar erros globais (401, 500, etc.)
    return Promise.reject(error);
  }
);

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

function splitSelection(values = [], otherValue = '') {
  const predefined = values.filter((value) => value !== 'none' && value !== 'other');

  return {
    predefined,
    custom: cleanString(otherValue),
  };
}

export function buildPlanPayload(onboardingData) {
  return {
    source: 'mobile_onboarding_v1',
    profile: {
      name: cleanString(onboardingData.name),
      goal: onboardingData.goal || null,
      biologicalSex: onboardingData.biologicalSex || null,
      weightKg: parseOptionalNumber(onboardingData.weight),
      heightCm: parseOptionalNumber(onboardingData.height),
      birthDate: formatDateOnly(onboardingData.birthDate),
      bodyFatPercentage: parseOptionalNumber(onboardingData.bodyFatPercentage),
    },
    training: {
      activityLevel: onboardingData.activityLevel || null,
      experienceLevel: onboardingData.experienceLevel || null,
      trainingDaysPerWeek: parseOptionalNumber(onboardingData.trainingDaysPerWeek),
      physicalRestrictions: splitSelection(
        onboardingData.physicalRestrictions,
        onboardingData.physicalRestrictionsOther
      ),
    },
    nutrition: {
      dietStyle: onboardingData.dietStyle || null,
      dietaryRestrictions: splitSelection(
        onboardingData.dietaryRestrictions,
        onboardingData.dietaryRestrictionsOther
      ),
      excludedFoods: splitSelection(
        onboardingData.excludedFoods,
        onboardingData.excludedFoodsOther
      ),
    },
    legal: {
      acceptedTerms: Boolean(onboardingData.legalAccepted),
    },
  };
}

export default api;
