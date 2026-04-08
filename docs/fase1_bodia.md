# Prompt para Claude Code — BodIA Mobile App (React Native / Expo)

## Contexto do Projeto

Estou desenvolvendo o **BodIA**, um aplicativo mobile de saúde e condicionamento físico. Este prompt é para criar a **estrutura inicial do app mobile** com todas as telas de onboarding e coleta de dados do usuário.

O app é **não-clínico** — voltado a pessoas saudáveis, sem substituir profissionais de saúde.

**O backend será feito separadamente em Python/FastAPI.** Aqui é SÓ o app mobile.

---

## Stack Técnica — SEGUIR RIGOROSAMENTE

- **Expo** (managed workflow)
- **React Native** com **JavaScript vanilla** — **SEM TypeScript**
- **React Navigation** (stack navigator) para navegação
- **Axios** — instalar e deixar pré-configurado para futura conexão com API
- **Context API** do React para gerenciamento de estado
- **AsyncStorage** para persistência local futura
- **NÃO usar**: TypeScript, Zustand, Redux, Zod, NativeWind, Tailwind, styled-components, nem qualquer lib de UI pronta (Paper, Elements, etc.)
- Estilização: **somente `StyleSheet.create()`** do React Native

---

## Estrutura de Pastas

Criar exatamente esta estrutura:

```
bodia-app/
├── App.js                          # Entry point, providers, navigation container
├── app.json                        # Expo config
├── package.json
├── babel.config.js
├── .env.example                    # API_URL=http://localhost:8000
├── assets/
│   └── (placeholder para imagens futuras)
├── src/
│   ├── contexts/
│   │   └── OnboardingContext.js     # Context que armazena TODOS os dados do onboarding
│   ├── navigation/
│   │   ├── AppNavigator.js          # Navigator principal
│   │   ├── OnboardingNavigator.js   # Stack navigator do fluxo de onboarding
│   │   └── AuthNavigator.js         # Stack navigator de autenticação (login, cadastro, recuperação)
│   ├── screens/
│   │   ├── WelcomeScreen.js         # Tela 1 - Boas-vindas
│   │   ├── onboarding/
│   │   │   ├── GoalScreen.js            # Tela 2 - Objetivo
│   │   │   ├── PhysicalDataScreen.js    # Tela 3 - Dados físicos
│   │   │   ├── ActivityLevelScreen.js   # Tela 4 - Nível de atividade
│   │   │   ├── ExperienceScreen.js      # Tela 5 - Experiência em treino
│   │   │   ├── TrainingDaysScreen.js    # Tela 6 - Dias disponíveis
│   │   │   ├── PhysicalRestrictionsScreen.js  # Tela 7 - Lesões/restrições físicas
│   │   │   ├── DietStyleScreen.js       # Tela 8 - Estilo de dieta
│   │   │   ├── DietaryRestrictionsScreen.js   # Tela 9 - Restrições alimentares
│   │   │   ├── FoodExclusionsScreen.js  # Tela 10 - Alimentos que não come
│   │   │   ├── LegalDisclaimerScreen.js # Tela 11 - Aviso legal
│   │   │   └── SummaryScreen.js         # Tela 13 - Resumo dos dados
│   │   └── auth/
│   │       ├── SignUpScreen.js          # Tela 12 - Criar conta
│   │       ├── LoginScreen.js           # Tela 14 - Login
│   │       └── ForgotPasswordScreen.js  # Tela 15 - Recuperação de senha
│   ├── components/
│   │   ├── ProgressDots.js          # Indicador de progresso (dots)
│   │   ├── PrimaryButton.js         # Botão principal verde
│   │   ├── SecondaryButton.js       # Botão secundário (outline ou cinza)
│   │   ├── SelectionCard.js         # Card de seleção única (objetivo, atividade, etc.)
│   │   ├── MultiSelectChip.js       # Chip de multi-seleção (restrições, alimentos)
│   │   ├── TextInputField.js        # Input de texto estilizado
│   │   ├── NumericInputField.js     # Input numérico com unidade (kg, cm, anos)
│   │   ├── ToggleSelector.js        # Toggle binário (Masculino/Feminino)
│   │   ├── ScreenHeader.js          # Header com título + subtítulo da tela
│   │   └── NavigationFooter.js      # Footer com dots + botões Voltar/Próximo
│   ├── services/
│   │   └── api.js                   # Instância Axios pré-configurada
│   ├── theme/
│   │   └── colors.js                # Paleta de cores centralizada
│   │   └── typography.js            # Estilos de tipografia
│   │   └── spacing.js               # Constantes de espaçamento
│   └── utils/
│       └── validators.js            # Validações de campos (email, idade, peso, etc.)
```

---

## Design System — SEGUIR FIELMENTE

### Paleta de Cores (`theme/colors.js`)

```javascript
export const colors = {
  // Primária — Verde
  primary: {
    50:  '#E8F7EE',
    200: '#A8E4BF',
    500: '#2EBD6B',   // COR PRINCIPAL — botões, seleções ativas
    700: '#1A8A4E',
    900: '#0D5C33',
  },
  // Destaque — Lima
  accent: {
    50:  '#F2FBDE',
    200: '#D4F29A',
    500: '#A8E24A',
    700: '#6FA830',
    900: '#3D6118',
  },
  // Neutros
  neutral: {
    white:   '#FFFFFF',
    bg:      '#F9FAFB',
    surface: '#F3F4F6',
    border:  '#E5E7EB',
    muted:   '#9CA3AF',
    secondary: '#4B5563',
    primary: '#1F2937',
  },
  // Semânticas
  success: { light: '#D1FAE5', base: '#34D399', dark: '#065F46' },
  warning: { light: '#FEF3C7', base: '#FBBF24', dark: '#92400E' },
  error:   { light: '#FEE2E2', base: '#F87171', dark: '#991B1B' },
};
```

### Tipografia (`theme/typography.js`)

Usar a fonte padrão do sistema (System / San Francisco no iOS, Roboto no Android). NÃO importar fontes externas.

```
- Heading 1: 28px, fontWeight '700'
- Heading 2: 22px, fontWeight '600'
- Heading 3: 18px, fontWeight '600'
- Body:      16px, fontWeight '400'
- Caption:   14px, fontWeight '400', cor neutral.secondary
- Small:     12px, fontWeight '400', cor neutral.muted
```

### Espaçamento (`theme/spacing.js`)

```
xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
```

### Cantos arredondados

- Botões: borderRadius 12
- Cards de seleção: borderRadius 12
- Inputs: borderRadius 10
- Cards containers: borderRadius 16
- Chips de multi-seleção: borderRadius 20 (pill)

### Padrões Visuais dos Componentes

#### `PrimaryButton`
- Background: `colors.primary[500]` (#2EBD6B)
- Texto: branco, 16px, fontWeight '600'
- Padding vertical: 14, borderRadius: 12
- Largura total (alignSelf: 'stretch')
- Estado desabilitado: opacity 0.5

#### `SecondaryButton`
- Background: `colors.neutral.surface` (#F3F4F6)
- Texto: `colors.neutral.secondary` (#4B5563), 14px, fontWeight '600'
- Padding vertical: 10, horizontal: 20, borderRadius: 10

#### `SelectionCard` (para seleção única — objetivo, atividade, experiência, estilo dieta)
- Estado normal: fundo branco, borda 1.5px `colors.neutral.border`, borderRadius 12
- Estado selecionado: fundo `colors.primary[50]` (#E8F7EE), borda 1.5px `colors.primary[500]` (#2EBD6B)
- Ícone à esquerda: quadrado 36x36 com borderRadius 10
  - Normal: fundo `colors.neutral.surface`, ícone cinza
  - Selecionado: fundo `colors.primary[500]`, ícone branco
- Título: 15px fontWeight '600'
  - Normal: `colors.neutral.primary`
  - Selecionado: `colors.primary[900]` (#0D5C33)
- Subtítulo: 12px
  - Normal: `colors.neutral.muted`
  - Selecionado: `colors.primary[700]`

#### `MultiSelectChip` (para restrições e alimentos)
- Estado normal: fundo `colors.neutral.surface`, borda 1px `colors.neutral.border`, borderRadius 20
- Estado selecionado: fundo `colors.primary[50]`, borda 1px `colors.primary[500]`
- Texto: 14px
- Padding vertical: 8, horizontal: 16
- Layout: flexWrap em rows, gap 8

#### `NumericInputField`
- Fundo: `colors.neutral.bg` (#F9FAFB)
- Borda: 0.5px `colors.neutral.border`
- borderRadius: 10
- Padding: 12 horizontal, 14 vertical
- Label acima: 13px, `colors.neutral.secondary`
- Unidade à direita: 12px, `colors.neutral.muted`
- Teclado numérico (keyboardType: 'numeric')

#### `ToggleSelector` (Masculino / Feminino)
- Dois botões lado a lado, flex: 1, gap: 8
- Ativo: fundo `colors.primary[500]`, texto branco
- Inativo: fundo `colors.neutral.surface`, texto `colors.neutral.secondary`
- borderRadius: 10, padding vertical: 10

#### `ProgressDots`
- Dots de 8x8, borderRadius 50%
- Ativo: `colors.primary[500]`
- Inativo: `colors.neutral.border`
- Gap: 4 entre dots
- Total: 11 dots (telas 2 a 12, excluindo welcome e telas de auth)

#### `ScreenHeader`
- Título: 22px, fontWeight '600', `colors.neutral.primary`
- Subtítulo: 14px, `colors.neutral.muted`, marginTop 4
- marginBottom: 24

#### `NavigationFooter`
- Posicionado na parte inferior da tela
- Flexbox row: ProgressDots à esquerda, botões à direita
- Botão "Voltar" (SecondaryButton) + Botão "Próximo" (PrimaryButton menor)
- Na primeira tela do onboarding: sem botão Voltar
- Na última tela: botão "Finalizar" em vez de "Próximo"

---

## Configuração do Axios (`services/api.js`)

```javascript
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

export default api;
```

---

## OnboardingContext — Estado Global do Onboarding

O `OnboardingContext.js` deve armazenar TODOS os dados coletados durante o fluxo:

```javascript
const initialState = {
  // Tela 2 - Objetivo (RF07)
  goal: null,                    // 'fat_loss' | 'maintenance' | 'muscle_gain'

  // Tela 3 - Dados físicos (RF05)
  biologicalSex: null,           // 'M' | 'F'
  weight: null,                  // número em kg
  height: null,                  // número em cm
  age: null,                     // número
  bodyFatPercentage: null,       // número ou null (opcional)

  // Tela 4 - Nível de atividade (RF06)
  activityLevel: null,           // 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'

  // Tela 5 - Experiência (RF32)
  experienceLevel: null,         // 'beginner' | 'intermediate' | 'advanced'

  // Tela 6 - Disponibilidade (RF31)
  trainingDaysPerWeek: null,     // 2 a 7

  // Tela 7 - Restrições físicas (RF09)
  physicalRestrictions: [],      // ['herniated_disc', 'knee_injury', ...]

  // Tela 8 - Estilo de dieta (novo)
  dietStyle: null,               // 'homemade' | 'practical' | 'strict' | 'flexible'

  // Tela 9 - Restrições alimentares (RF08)
  dietaryRestrictions: [],       // ['lactose_intolerant', 'vegan', 'gluten_free', ...]

  // Tela 10 - Alimentos excluídos (novo)
  excludedFoods: [],             // ['red_meat', 'shrimp', 'milk', ...]

  // Tela 11 - Aviso legal (RF36)
  legalAccepted: false,
};
```

O Context deve expor:
- `onboardingData` — o estado completo
- `updateOnboarding(field, value)` — atualiza um campo específico
- `resetOnboarding()` — limpa tudo

---

## Detalhamento de Cada Tela

### Tela 1 — `WelcomeScreen.js`
- Centralizada verticalmente
- Logo: texto "Bod" em `colors.neutral.primary` + "IA" em `colors.primary[500]`, fontSize 40, fontWeight '700'
- Subtítulo: "Seu plano inteligente de treino e dieta", 14px, `colors.neutral.muted`
- Botão "Começar" (PrimaryButton) — navega direto para GoalScreen (início do onboarding)
- Botão "Já tenho conta" — botão texto abaixo, `colors.primary[500]`, sem fundo — navega para LoginScreen
- SEM ProgressDots, SEM NavigationFooter

### Tela 2 — `GoalScreen.js` (Onboarding step 1/11)
- ScreenHeader: título "Qual seu objetivo?", subtítulo "Isso vai guiar seu plano personalizado"
- 3 SelectionCards (seleção única):
  1. Ícone seta pra cima — "Ganhar massa" / "Foco em hipertrofia" → `muscle_gain`
  2. Ícone traço horizontal — "Manter peso" / "Equilíbrio e saúde" → `maintenance`
  3. Ícone seta pra baixo — "Perder gordura" / "Definição corporal" → `fat_loss`
- NavigationFooter: dots (1/11 ativo), só botão Próximo (sem Voltar)
- Próximo desabilitado até selecionar uma opção

### Tela 3 — `PhysicalDataScreen.js` (Onboarding step 2/11)
- ScreenHeader: "Seus dados físicos", "Precisamos disso pra calcular seu plano"
- ToggleSelector: Masculino / Feminino
- NumericInputField: Peso (kg) — placeholder "75"
- NumericInputField: Altura (cm) — placeholder "175"
- NumericInputField: Idade (anos) — placeholder "25"
- NumericInputField: Gordura corporal % (opcional) — placeholder "15" — com label "(opcional)" ao lado
- NavigationFooter: dots (2/11), Voltar + Próximo
- Validações: peso 30-300, altura 100-250, idade 14-80, gordura 3-60

### Tela 4 — `ActivityLevelScreen.js` (Onboarding step 3/11)
- ScreenHeader: "Seu nível de atividade", "Como é sua rotina no dia a dia?"
- 5 SelectionCards (seleção única):
  1. "Sedentário" / "Trabalho sentado, sem exercício" → `sedentary`
  2. "Levemente ativo" / "Exercício leve 1-3x/semana" → `lightly_active`
  3. "Moderadamente ativo" / "Exercício moderado 3-5x/semana" → `moderately_active`
  4. "Muito ativo" / "Exercício intenso 6-7x/semana" → `very_active`
  5. "Extremamente ativo" / "Atleta ou trabalho físico pesado" → `extremely_active`
- NavigationFooter: dots (3/11), Voltar + Próximo

### Tela 5 — `ExperienceScreen.js` (Onboarding step 4/11)
- ScreenHeader: "Experiência com treino", "Há quanto tempo você treina?"
- 3 SelectionCards:
  1. "Iniciante" / "Menos de 6 meses treinando" → `beginner`
  2. "Intermediário" / "6 meses a 2 anos treinando" → `intermediate`
  3. "Avançado" / "Mais de 2 anos treinando" → `advanced`
- NavigationFooter: dots (4/11), Voltar + Próximo

### Tela 6 — `TrainingDaysScreen.js` (Onboarding step 5/11)
- ScreenHeader: "Dias de treino", "Quantos dias por semana você pode treinar?"
- Seletor visual: 6 botões circulares (ou quadrados arredondados) lado a lado para os números 2, 3, 4, 5, 6, 7
  - Normal: fundo `colors.neutral.surface`, texto `colors.neutral.secondary`
  - Selecionado: fundo `colors.primary[500]`, texto branco
  - Tamanho: ~56x56, borderRadius 12, fontSize 20, fontWeight '600'
- Texto descritivo abaixo que muda conforme a seleção:
  - 2: "Full Body — treino completo a cada sessão"
  - 3: "Push/Pull/Legs — uma divisão clássica"
  - 4: "Upper/Lower — alternando superior e inferior"
  - 5: "ABCDE — um grupo muscular por dia"
  - 6: "Push/Pull/Legs x2 — volume máximo"
  - 7: não oferecer (máximo 6 nesta tela, mesmo que o backend aceite 7)
- Correção: oferecer 2 a 6 (5 botões), não 7. Manter consistente com as divisões de treino.
- NavigationFooter: dots (5/11), Voltar + Próximo

### Tela 7 — `PhysicalRestrictionsScreen.js` (Onboarding step 6/11)
- ScreenHeader: "Restrições físicas", "Tem alguma lesão ou limitação? Seu plano vai respeitar isso"
- MultiSelectChips (pode selecionar vários ou nenhum):
  - "Hérnia de disco" → `herniated_disc`
  - "Lesão no joelho" → `knee_injury`
  - "Lesão no ombro" → `shoulder_injury`
  - "Dor lombar" → `lower_back_pain`
  - "Tendinite" → `tendinitis`
  - "Lesão no punho" → `wrist_injury`
  - "Nenhuma" → limpa todas as outras seleções
- Quando "Nenhuma" é selecionado, desmarca todas as outras. Quando qualquer outra é selecionada, desmarca "Nenhuma".
- NavigationFooter: dots (6/11), Voltar + Próximo

### Tela 8 — `DietStyleScreen.js` (Onboarding step 7/11)
- ScreenHeader: "Estilo de dieta", "Como você prefere se alimentar?"
- 4 SelectionCards (seleção única):
  1. Ícone casa — "Comida caseira" / "Arroz, feijão, carne, salada..." → `homemade`
  2. Ícone relógio — "Prática e rápida" / "Marmitas, lanches, praticidade" → `practical`
  3. Ícone alvo — "Dieta restritiva" / "Frango, batata doce, ovo, brócolis..." → `strict`
  4. Ícone check duplo — "Flexível" / "Como de tudo, sem frescura" → `flexible`
- NavigationFooter: dots (7/11), Voltar + Próximo

### Tela 9 — `DietaryRestrictionsScreen.js` (Onboarding step 8/11)
- ScreenHeader: "Restrições alimentares", "Alguma alergia ou dieta especial?"
- MultiSelectChips:
  - "Intolerância à lactose" → `lactose_intolerant`
  - "Alergia a glúten" → `gluten_free`
  - "Vegano" → `vegan`
  - "Vegetariano" → `vegetarian`
  - "Alergia a frutos do mar" → `seafood_allergy`
  - "Alergia a amendoim" → `peanut_allergy`
  - "Nenhuma" → limpa tudo
- Mesma lógica de "Nenhuma" da tela 7
- NavigationFooter: dots (8/11), Voltar + Próximo

### Tela 10 — `FoodExclusionsScreen.js` (Onboarding step 9/11)
- ScreenHeader: "Alimentos que você não come", "Toque pra excluir do seu plano"
- Lista organizada por categorias com labels de seção:
  - **Proteínas**: Frango (`chicken`), Carne vermelha (`red_meat`), Peixe (`fish`), Ovo (`egg`), Porco (`pork`), Camarão (`shrimp`)
  - **Carboidratos**: Arroz (`rice`), Batata doce (`sweet_potato`), Macarrão (`pasta`), Pão (`bread`), Aveia (`oats`)
  - **Vegetais**: Brócolis (`broccoli`), Espinafre (`spinach`), Abobrinha (`zucchini`), Beterraba (`beet`)
  - **Frutas**: Banana (`banana`), Abacate (`avocado`), Morango (`strawberry`)
  - **Laticínios/Outros**: Leite (`milk`), Queijo (`cheese`), Amendoim/Castanhas (`nuts`)
- Usar MultiSelectChip mas agrupados por seção
- Label de seção: 13px, fontWeight '600', `colors.neutral.secondary`, marginTop 16, marginBottom 8
- **Lógica inteligente**: se na tela 9 o usuário selecionou "Vegano", já marcar automaticamente como excluídos: chicken, red_meat, fish, egg, pork, shrimp, milk, cheese — e exibir esses chips desabilitados (opacity 0.4) com um label "Excluído pela sua dieta vegana"
- Se selecionou "Vegetariano", excluir automaticamente: chicken, red_meat, fish, pork, shrimp
- Se selecionou "Intolerância à lactose", excluir: milk, cheese
- Se selecionou "Alergia a frutos do mar", excluir: fish, shrimp
- Se selecionou "Alergia a amendoim", excluir: nuts
- Permitir que o usuário continue SEM excluir nada (tudo ok se a pessoa come de tudo)
- NavigationFooter: dots (9/11), Voltar + Próximo

### Tela 11 — `LegalDisclaimerScreen.js` (Onboarding step 10/11)
- ScreenHeader: "Aviso importante", "Leia com atenção antes de continuar"
- Card com fundo `colors.neutral.bg`, borderRadius 12, padding 16, contendo texto:
  - "O BodIA oferece recomendações de treino e alimentação para fins informativos e educacionais. As sugestões geradas pelo aplicativo NÃO substituem a orientação de profissionais de saúde habilitados, como médicos, nutricionistas e educadores físicos."
  - "Consulte um profissional antes de iniciar qualquer programa de exercícios ou dieta, especialmente se você possui condições de saúde pré-existentes."
  - "Ao continuar, você declara que compreendeu e aceita estes termos."
- Checkbox estilizado na parte inferior: "Li e aceito os termos de uso" — quando marcado, `legalAccepted = true`
  - Checkbox: quadrado 22x22, borderRadius 6, borda `colors.neutral.border`
  - Quando marcado: fundo `colors.primary[500]`, ícone check branco
- NavigationFooter: dots (10/11), Voltar + Próximo
- Botão Próximo desabilitado até o checkbox ser marcado

### Tela 12 — `SignUpScreen.js` (NÃO faz parte do onboarding navigator — está no auth navigator)
- Mas é acessada após completar o onboarding (LegalDisclaimerScreen navega pra cá)
- ScreenHeader: "Criar sua conta", "Pra salvar seu plano personalizado"
- TextInputField: Nome completo — placeholder "Seu nome"
- TextInputField: E-mail — placeholder "seu@email.com" — keyboardType 'email-address'
- TextInputField: Senha — secureTextEntry, placeholder "Mínimo 8 caracteres"
- TextInputField: Data de nascimento — placeholder "DD/MM/AAAA" — com máscara simples
- PrimaryButton: "Criar conta"
- Texto abaixo: "Já tem conta? Entrar" — link pra LoginScreen
- SEM ProgressDots (não faz parte do onboarding flow visualmente)
- Validações: email formato válido, senha min 8 chars, nome não vazio, data formato válido

### Tela 13 — `SummaryScreen.js` (Onboarding step 11/11)
- Acessada após SignUp (ou pode ser antes, dependendo do fluxo)
- ScreenHeader: "Tudo pronto!", "Confira seus dados antes de gerar o plano"
- ScrollView com cards resumo organizados por seção:
  - **Objetivo**: card mostrando o objetivo selecionado
  - **Dados físicos**: peso, altura, idade, sexo, gordura (se informada)
  - **Treino**: nível de atividade, experiência, dias/semana, divisão sugerida
  - **Alimentação**: estilo de dieta, restrições, alimentos excluídos
- Cada seção: label 13px `colors.neutral.muted` + valor 15px `colors.neutral.primary`
- Botão "Editar" discreto ao lado de cada seção (texto `colors.primary[500]`, sem fundo) — navega de volta à respectiva tela
- PrimaryButton no final: "Gerar meu plano" (por enquanto só mostra um Alert de sucesso)
- NavigationFooter: dots (11/11), Voltar + Gerar meu plano

### Tela 14 — `LoginScreen.js`
- ScreenHeader: "Bem-vindo de volta", "Entre na sua conta"
- TextInputField: E-mail
- TextInputField: Senha (secureTextEntry)
- PrimaryButton: "Entrar"
- Texto link: "Esqueceu a senha?" → ForgotPasswordScreen
- Texto link: "Não tem conta? Criar conta" → SignUpScreen
- SEM ProgressDots

### Tela 15 — `ForgotPasswordScreen.js`
- ScreenHeader: "Recuperar senha", "Enviaremos um link pro seu e-mail"
- TextInputField: E-mail
- PrimaryButton: "Enviar link"
- Texto link: "Voltar pro login" → LoginScreen
- SEM ProgressDots

---

## Navegação (React Navigation)

### `AppNavigator.js`
- NavigationContainer wrapping tudo
- Stack.Navigator sem header (headerShown: false)
- Telas:
  - 'Welcome' → WelcomeScreen
  - 'Onboarding' → OnboardingNavigator
  - 'Auth' → AuthNavigator

### `OnboardingNavigator.js`
- Stack.Navigator sem header
- Telas na ordem:
  1. 'Goal' → GoalScreen
  2. 'PhysicalData' → PhysicalDataScreen
  3. 'ActivityLevel' → ActivityLevelScreen
  4. 'Experience' → ExperienceScreen
  5. 'TrainingDays' → TrainingDaysScreen
  6. 'PhysicalRestrictions' → PhysicalRestrictionsScreen
  7. 'DietStyle' → DietStyleScreen
  8. 'DietaryRestrictions' → DietaryRestrictionsScreen
  9. 'FoodExclusions' → FoodExclusionsScreen
  10. 'LegalDisclaimer' → LegalDisclaimerScreen
  11. 'Summary' → SummaryScreen
- Animação de transição: slide da direita (padrão)

### `AuthNavigator.js`
- Stack.Navigator sem header
- Telas:
  - 'SignUp' → SignUpScreen
  - 'Login' → LoginScreen
  - 'ForgotPassword' → ForgotPasswordScreen

### Fluxo de navegação:
```
WelcomeScreen
  ├── "Começar" → Onboarding/Goal
  └── "Já tenho conta" → Auth/Login

Onboarding: Goal → PhysicalData → ActivityLevel → Experience → TrainingDays → PhysicalRestrictions → DietStyle → DietaryRestrictions → FoodExclusions → LegalDisclaimer → Summary

Summary
  └── "Gerar meu plano" → Auth/SignUp (por enquanto)

Auth/SignUp
  ├── "Criar conta" → (por enquanto, Alert de sucesso)
  └── "Já tem conta?" → Auth/Login

Auth/Login
  ├── "Entrar" → (por enquanto, Alert de sucesso)
  ├── "Esqueceu a senha?" → Auth/ForgotPassword
  └── "Não tem conta?" → Auth/SignUp
```

---

## Regras Importantes

1. **JavaScript VANILLA** — nenhum arquivo .ts ou .tsx. Todos .js.
2. **Expo managed workflow** — usar `npx create-expo-app` como base.
3. **StyleSheet.create()** para TODOS os estilos. Nenhum estilo inline exceto quando dinamicamente calculado.
4. **Componentes reutilizáveis** — os componentes da pasta `components/` devem ser genéricos e receber tudo por props.
5. **ScrollView ou KeyboardAvoidingView** nas telas com inputs pra não ficar escondido pelo teclado.
6. **SafeAreaView** em todas as telas.
7. **Sem lógica de API real** — nenhum fetch/post real. Tudo é navegação e estado local.
8. **Sem autenticação real** — as telas de auth são apenas UI por enquanto.
9. **Código em inglês**, textos da UI em **português brasileiro**.
10. **Cada arquivo com menos de 200 linhas** — se passar, extrair em componentes menores.
11. **Instalar Axios** e deixar o `services/api.js` configurado mas sem uso real ainda.
12. **Instalar @react-native-async-storage/async-storage** mas sem uso real ainda.
13. **Não instalar libs de ícones pesadas.** Para os poucos ícones necessários (setas, check, casa, relógio, alvo), usar caracteres unicode simples ou criar componentes SVG mínimos inline. Se preferir, pode instalar `@expo/vector-icons` que já vem com Expo.
14. Todo `onPress` dos botões de navegação deve primeiro salvar os dados no `OnboardingContext` antes de navegar.