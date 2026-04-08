# BodIA — Mobile App

App mobile de saúde e condicionamento físico que gera planos personalizados de treino e dieta com base no perfil do usuário.

> O app é **não-clínico** — voltado a pessoas saudáveis, sem substituir profissionais de saúde.

---

## Stack

| Tecnologia | Versão | Função |
|---|---|---|
| Expo (managed) | ~54.0.0 | Base do projeto |
| React Native | 0.81.5 | Framework mobile |
| React | 19.1.0 | UI |
| React Navigation (Stack) | ^7.x | Navegação |
| Axios | ^1.x | Cliente HTTP (pré-configurado) |
| AsyncStorage | 2.2.0 | Persistência local (reservado) |
| DateTimePicker | 8.4.4 | Seletor de data nativo iOS/Android |

**Sem TypeScript** — todo o projeto é JavaScript vanilla.  
**Sem libs de UI** — estilização exclusivamente via `StyleSheet.create()`.

---

## Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go instalado no celular (SDK 54)

---

## Instalação

```bash
git clone <repo-url>
cd mobile
npm install
```

Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

---

## Rodando o projeto

```bash
# Inicia o servidor Metro com QR code
npx expo start

# Abre direto no Android
npx expo start --android

# Abre direto no iOS
npx expo start --ios

# Limpa cache (use se houver erros estranhos)
npx expo start --clear
```

Escaneie o QR code com o Expo Go para abrir no celular.

---

## Estrutura de pastas

```
mobile/
├── App.js                          # Entry point — providers e navigator
├── index.js                        # Registro do componente raiz
├── app.json                        # Configuração Expo
├── babel.config.js
├── .env.example                    # API_URL=http://localhost:8000
│
├── assets/                         # Imagens e ícones
│
└── src/
    ├── contexts/
    │   └── OnboardingContext.js    # Estado global do onboarding (Context API)
    │
    ├── navigation/
    │   ├── AppNavigator.js         # Navigator raiz (NavigationContainer)
    │   ├── OnboardingNavigator.js  # Stack do fluxo de onboarding
    │   └── AuthNavigator.js        # Stack de autenticação
    │
    ├── screens/
    │   ├── SplashScreen.js         # Splash animada (verde + logo)
    │   ├── WelcomeScreen.js        # Tela inicial
    │   ├── onboarding/
    │   │   ├── NameScreen.js           # Passo 1  — Nome
    │   │   ├── GoalScreen.js           # Passo 2  — Objetivo
    │   │   ├── PhysicalDataScreen.js   # Passo 3  — Dados físicos
    │   │   ├── ActivityLevelScreen.js  # Passo 4  — Nível de atividade
    │   │   ├── ExperienceScreen.js     # Passo 5  — Experiência
    │   │   ├── TrainingDaysScreen.js   # Passo 6  — Dias de treino
    │   │   ├── PhysicalRestrictionsScreen.js  # Passo 7  — Restrições físicas
    │   │   ├── DietStyleScreen.js      # Passo 8  — Estilo de dieta
    │   │   ├── DietaryRestrictionsScreen.js   # Passo 9  — Restrições alimentares
    │   │   ├── FoodExclusionsScreen.js # Passo 10 — Alimentos excluídos
    │   │   ├── LegalDisclaimerScreen.js# Passo 11 — Aviso legal
    │   │   └── SummaryScreen.js        # Passo 12 — Resumo
    │   └── auth/
    │       ├── SignUpScreen.js         # Criar conta
    │       ├── LoginScreen.js          # Login
    │       └── ForgotPasswordScreen.js # Recuperar senha
    │
    ├── components/
    │   ├── PrimaryButton.js        # Botão verde principal
    │   ├── SecondaryButton.js      # Botão secundário cinza
    │   ├── ScreenHeader.js         # Título + subtítulo de tela
    │   ├── NavigationFooter.js     # Footer com ProgressDots + botões Voltar/Próximo
    │   ├── ProgressDots.js         # Indicador de progresso (12 dots)
    │   ├── SelectionCard.js        # Card de seleção única
    │   ├── MultiSelectChip.js      # Chip de múltipla seleção
    │   ├── TextInputField.js       # Input de texto estilizado
    │   ├── NumericInputField.js    # Input numérico com unidade (kg, cm, %)
    │   ├── DatePickerField.js      # Seletor de data nativo iOS/Android
    │   └── ToggleSelector.js       # Toggle binário (ex: Masculino/Feminino)
    │
    ├── services/
    │   └── api.js                  # Instância Axios (baseURL, interceptors de auth e erro)
    │
    ├── theme/
    │   ├── colors.js               # Paleta de cores (verde primário, lima, neutros)
    │   ├── typography.js           # Estilos de tipografia
    │   └── spacing.js              # Constantes de espaçamento (xs → xxxl)
    │
    └── utils/
        └── validators.js           # Validações: email, senha, peso, altura, data, etc.
```

---

## Fluxo de navegação

```
SplashScreen
  └── WelcomeScreen
        ├── "Começar" → Onboarding/Name
        └── "Já tenho conta" → Auth/Login

Onboarding (12 passos):
  Name → Goal → PhysicalData → ActivityLevel → Experience →
  TrainingDays → PhysicalRestrictions → DietStyle →
  DietaryRestrictions → FoodExclusions → LegalDisclaimer → Summary

Summary
  └── "Gerar meu plano" → (integração com API — a implementar)

Auth:
  SignUp ↔ Login ↔ ForgotPassword
```

---

## Estado global — OnboardingContext

Todos os dados coletados no onboarding ficam em `OnboardingContext`. Os campos disponíveis são:

```js
{
  name,               // string
  goal,               // 'muscle_gain' | 'maintenance' | 'fat_loss'
  biologicalSex,      // 'M' | 'F'
  weight,             // string (kg)
  height,             // string (cm)
  birthDate,          // Date object
  bodyFatPercentage,  // string | null (opcional)
  activityLevel,      // 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  experienceLevel,    // 'beginner' | 'intermediate' | 'advanced'
  trainingDaysPerWeek,// 2 | 3 | 4 | 5 | 6
  physicalRestrictions, // string[]
  dietStyle,          // 'homemade' | 'practical' | 'strict' | 'flexible'
  dietaryRestrictions,  // string[]
  excludedFoods,        // string[]
  legalAccepted,        // boolean
}
```

Para atualizar um campo de qualquer tela:

```js
const { onboardingData, updateOnboarding } = useOnboarding();
updateOnboarding('goal', 'muscle_gain');
```

---

## Integração com API

O cliente HTTP está pré-configurado em `src/services/api.js` apontando para `http://localhost:8000` (backend Python/FastAPI).

Para enviar os dados do onboarding ao backend, adicionar em `SummaryScreen.js`:

```js
import api from '../../services/api';

async function handleGenerate() {
  const payload = {
    ...onboardingData,
    birthDate: onboardingData.birthDate?.toISOString(),
  };
  const response = await api.post('/onboarding', payload);
}
```

O interceptor de autenticação em `api.js` já tem o espaço reservado para adicionar o Bearer token quando o login for implementado.

---

## Tema visual

| Token | Valor | Uso |
|---|---|---|
| `primary[500]` | `#2EBD6B` | Botões, seleções ativas, splash |
| `primary[50]` | `#E8F7EE` | Fundo de cards selecionados |
| `accent[500]` | `#A8E24A` | Destaque no logo (splash) |
| `neutral.bg` | `#F9FAFB` | Fundo de inputs e cards |
| `neutral.border` | `#E5E7EB` | Bordas |

Paleta completa em `src/theme/colors.js`.
