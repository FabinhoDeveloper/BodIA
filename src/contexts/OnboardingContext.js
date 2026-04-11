import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext(null);

const initialState = {
  // Tela 1 - Nome
  name: null,

  // Tela 2 - Objetivo
  goal: null,

  // Tela 3 - Dados físicos
  biologicalSex: null,
  weight: null,
  height: null,
  birthDate: null,
  bodyFatPercentage: null,

  // Tela 4 - Nível de atividade
  activityLevel: null,

  // Tela 5 - Experiência
  experienceLevel: null,

  // Tela 6 - Disponibilidade
  trainingDaysPerWeek: null,

  // Tela 7 - Restrições físicas
  physicalRestrictions: [],
  physicalRestrictionsOther: '',

  // Tela 8 - Estilo de dieta
  dietStyle: null,

  // Tela 9 - Restrições alimentares
  dietaryRestrictions: [],
  dietaryRestrictionsOther: '',

  // Tela 10 - Alimentos excluídos
  excludedFoods: [],
  excludedFoodsOther: '',

  // Tela 11 - Aviso legal
  legalAccepted: false,
};

export function OnboardingProvider({ children }) {
  const [onboardingData, setOnboardingData] = useState(initialState);

  function updateOnboarding(field, value) {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  }

  function resetOnboarding() {
    setOnboardingData(initialState);
  }

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
