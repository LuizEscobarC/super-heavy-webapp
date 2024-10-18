# 1 - Etapa inicial - configuração
* Quero cadastrar meus meu tipo de treinamento, por dia, o que eu faria, exemplo:
  - segunda: biceps
  - terça: quadriceps, posterior
  - quarta: costas e trapezio
  - quinta: antebraço completo
  - sexta: peito e ombro
  - sabado: panturilha e abs
CRUD de cadastro de treinos por dia, cada treino tem que ter um dia, e esses treinos tem um nome específico que seriam organizados.
    exemplo: 
    * biceps:
        - rosca direta (4x),
        - rosca martelo (4x),
        - rosca sentado (3x),
        - rosca unilataeral na polia (4x),
        - biceeps isometria unilateral na polia martelo(2x) e
        - biceps isometria unilateral na polia(2x).
    
    - tabelas:

      * workout-category (força, hipertrofia, resistencia, flexível)
        - Quantidade de repeticões
        - Carga (maxima, media, baixa)
      * week-days
        - dias da semana
        - numero
        - label
      * user-workout
        - workout_category_id
        - week_day_id
      * user_workout_exercises
        - user_workout_id
        - exercise_id
        - initial_weight
        - actually_weight
      * exercises
        - photo
        - name
        - description
        - muscle_group_id
      * muscle_group
        - photo
        - name
        - description








# 2 - Aao inves de personalizar por completo meu treino semanal eu poderia escolher treino pré programados por semana.
  - ABC, ABCD, ABCDE.
  - Poderia escolher treinos pré prontos para strongman, para volei, para queda de braços, para maromba, futebol...
     - No MVP posso ter treino de força (pesquisar)
     - Treino de resistência (pesqusiar)
     - Treino de hipertrofia (ABC normal)
  - Na tela inicial ao invez de cadastrar a personalizado escolher a opção de utilizar algo que já existe.

# 3 - Após isso poderia escolher para meus treinos meu objetivo, força, resistencia, hipertrofia.
  - com isso minha evolução de carga seria com base no objetivo.
  - com isso minha repetições seriam com base no objetivo.
  - por exemplo, treino de força me exigiria de 3 - 5 repetições, enquanto o treino de hipertrofia seria de 8 - 15 repetições.
# 4 - Cadastro de exercícios por dia.
  - segunda, terça, quarta...
# 5 - tela de preenchimento diário de evolução de carga por exercicios.
  - Cada exercicios teria um campo onde eu cadastraria se consegui efetuar no dia aquele objetivo de carga e repetições.
  - Caso contrário teria outro inputtt colocando a carga que consegui efetuar.
  - Assim toda semana ou mês dependendo do objettivo, teria uma recomendação de carga com base em calculos.
  - Cada exercício que a carga inicial já foi cadastrada jáa teria uma recomendação toda semana ou mes.
  - Assim o usuario poderia entender como ele está se saindo todos os meses.
# 6 - Tela para acessar meus exercícios agrupados por dia.
# 7 - Tela para acessar o peso atual de cada exercício.
# 8 - tela para acessar o histttório de evolução de um exercícios específico.
# 9 - tela de dashboard para poder ver a evolução de cada grupamento muscular.
# 10 - tela de pesos do agrupamentto muscular.
   - Deve conter todos os exercicios vinculado a esse agrupamento e seu peso.
   - Deve conter a média de força do musculo pegando como base o peso final de todos os exercícios.

Avançado, pós MVP

# 11 - Tela dinamica que o usuario escolhe escolhe o dia, por padrão vai vir o dia attual com os exercícios que ele cadastrou para o dia.
   - A tela vai conttter um bottão gigante de inciar treino.
   - A tela vai ter o seguinte fluxo
     - O aluno vai iniciar o treino
     - Vai ter o bottão para começar a execução do exercicio
     - input para anotar o peso que ele executou
     - vai ter a informação de quanttidade de repetttições
     - quantidade de peso
     - qual é o exercicio
     - E ao clicar iniciar execução (1,2,3,4...)
     - Vai ficar um "aguardando execução" na ttela com um bottão, terminei.
     - Aí vai rodar um cronometrto com descanço com base no objetivo, ou personalizado.
     - Esse cronometro apita algo no final.
     - O usuário vai anotar o peso a cada repettição até finalizar, isso vai gerar uma média com arredondamento de peso.
     - Após finalizar o treino o usuário vai ter um ponto de gamificação.
    
# 12 - vai ter uma tela de gamificação, onde terão ranking de frequencia (6 dias por semana)
   - quais serão as regras? ainda não sei.    
   
