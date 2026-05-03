import { DailyStudyPlanItem, Exam, ExamTopic, Patient, Question, TheoryMedication } from "../types";
import { nowIso } from "../utils/dateUtils";

const stamp = "2026-05-03T00:00:00.000Z";
const avatarUrl = "avatar://economia-sofia";
const avatarAlt = "Avatar de paciente de Economia representado por uma pessoa estudando gráficos, livros e conceitos econômicos.";

const descriptions: Record<string, string> = {
  "Inflação": "Aumento constante e generalizado dos preços e perda do poder de compra.",
  "Tipos de inflação": "Classificações como demanda, custos, inercial, estrutural e reprimida.",
  "Política monetária": "Ações do Banco Central sobre moeda, juros, crédito e atividade econômica.",
  "Taxa de juros": "Preço do dinheiro no tempo e seus efeitos sobre crédito, consumo e investimento.",
  "PIB": "Produto Interno Bruto e formas de mensuração da produção da economia.",
  "Oferta e demanda": "Curvas de mercado, quantidade demandada/ofertada e movimentos de preço.",
  "Moeda e funções da moeda": "Moeda como troca, medida de valor, reserva de valor e pagamentos diferidos.",
  "PIB pela ótica da demanda": "Cálculo do PIB por consumo, governo, investimento e setor externo.",
  "PIB pela ótica da produção": "PIB por valor adicionado, impostos e subsídios.",
  "Equilíbrio de mercado": "Ponto em que quantidade ofertada iguala quantidade demandada.",
  "Elasticidade": "Sensibilidade da demanda ou oferta a preço, renda e outras variáveis.",
  "Comportamento do consumidor": "Escolhas, preferências, utilidade e restrição orçamentária.",
  "Curvas de indiferença": "Cestas que geram o mesmo nível de satisfação ao consumidor.",
  "Restrição orçamentária": "Limite de consumo dado por renda e preços.",
  "Agentes econômicos": "Famílias, empresas, governo, intermediários financeiros e setor externo.",
  "Fluxo circular da renda": "Relações reais e monetárias entre famílias e empresas.",
  "Poupança e investimento": "Relação entre renda não consumida, financiamento e formação de capital.",
  "Mercado financeiro": "Intermediação entre poupadores, investidores, crédito e aplicações.",
};

export const economyExamPatients: Patient[] = Object.keys(descriptions).map((name) => ({
  id: `economia-${name}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
  name,
  subject: "Economia",
  description: descriptions[name],
  status: "not_triaged",
  cureIndex: 0,
  hearts: 3,
  attempts: 0,
  consecutiveGreen: 0,
  createdAt: stamp,
  updatedAt: stamp,
  tags: ["Economia", name, "Prova de Economia"],
  avatarUrl,
  avatarAlt,
  avatarStyle: "economy",
}));

function med(topic: string, summary: string, formulas: string[], whenToUse: string[], commonMistakes: string[], solvedExample: string, flashcards: { front: string; back: string }[]): TheoryMedication {
  return {
    id: `med-eco-${topic}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
    title: topic,
    subject: "Economia",
    topic,
    summary,
    formulas,
    whenToUse,
    commonMistakes,
    solvedExample,
    flashcards,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export const economyExamMedications: TheoryMedication[] = [
  med("Inflação", "Inflação é o aumento constante e generalizado do nível de preços de uma economia. Ela não significa apenas que um produto ficou caro, mas sim que vários bens e serviços sobem de preço de forma persistente. A taxa de inflação mede o percentual de aumento do nível geral de preços em determinado período. Quando há queda sustentada no nível de preços, ocorre deflação.", ["Taxa de inflação = ((Preço atual - Preço anterior) / Preço anterior) × 100"], ["Use quando a questão falar de aumento generalizado de preços.", "Use taxa de inflação para variação percentual.", "Use deflação para queda sustentada dos preços.", "Use inflação para analisar perda do poder de compra."], ["Confundir inflação com aumento isolado.", "Achar que inflação é sempre causada pelo governo.", "Confundir inflação com recessão.", "Confundir deflação com redução temporária.", "Esquecer que inflação reduz poder de compra."], "Um produto custava R$ 100,00 e passou para R$ 112,00. Taxa = ((112 - 100) / 100) × 100 = 12%.", [{ front: "O que é inflação?", back: "Aumento constante e generalizado do nível de preços." }, { front: "O que é taxa de inflação?", back: "Percentual de aumento do nível geral de preços." }, { front: "O que é deflação?", back: "Queda sustentada no nível de preços." }]),
  med("Tipos de inflação", "A inflação pode surgir por demanda, custos, inércia, estrutura ou repressão artificial de preços. Demanda ocorre quando a procura cresce mais rápido que a capacidade produtiva. Custos vem de insumos mais caros. Inercial segue reajustes passados. Estrutural vem de gargalos. Reprimida aparece quando preços são segurados artificialmente.", [], ["Use demanda para excesso de consumo ou renda.", "Use custos para petróleo, energia, transporte, salários ou insumos.", "Use inercial para indexação e reajustes automáticos.", "Use estrutural para gargalos e baixa produtividade.", "Use reprimida para congelamento artificial."], ["Confundir demanda com custos.", "Achar que toda inflação vem de excesso de dinheiro.", "Confundir inercial com estrutural.", "Esquecer que reprimida pode aparecer acumulada."], "Se o petróleo sobe e o transporte fica mais caro, aumentando preços finais, trata-se de inflação de custos.", [{ front: "Inflação de demanda?", back: "Demanda maior que capacidade produtiva." }, { front: "Inflação de custos?", back: "Aumento dos custos de produção." }, { front: "Inflação inercial?", back: "Reajustes baseados na inflação passada." }, { front: "Inflação estrutural?", back: "Gargalos e ineficiências da economia." }]),
  med("Política monetária", "Política monetária é o conjunto de ações usadas pelo Banco Central para controlar oferta de moeda, taxa de juros, crédito e nível de atividade. Pode ser expansionista, com mais moeda e juros menores, ou contracionista, com menos moeda e juros maiores para conter inflação.", [], ["Use expansionista para estimular economia, aumentar moeda ou reduzir juros.", "Use contracionista para combater inflação, reduzir moeda ou aumentar juros.", "Use política monetária em questões sobre Banco Central, juros, moeda e crédito."], ["Achar que aumentar juros estimula consumo.", "Confundir política monetária com fiscal.", "Achar que política contracionista aumenta demanda.", "Esquecer que juros altos reduzem consumo e investimento."], "Se a inflação está alta por excesso de demanda, elevar juros encarece crédito, reduz consumo e investimento e diminui pressão sobre preços.", [{ front: "Expansionista?", back: "Mais moeda, juros menores e estímulo à demanda." }, { front: "Contracionista?", back: "Menos moeda, juros maiores e contenção da demanda." }, { front: "Quem conduz?", back: "Banco Central." }]),
  med("Moeda e funções da moeda", "Moeda é um objeto de aceitação geral usado na troca de bens e serviços. Suas funções principais são intermediária de trocas, medida de valor, reserva de valor e padrão de pagamentos diferidos.", [], ["Use intermediária para facilitar compras.", "Use medida de valor para comparar preços.", "Use reserva de valor para guardar riqueza/liquidez.", "Use pagamentos diferidos para pagamentos futuros."], ["Achar que moeda serve apenas para comprar.", "Confundir reserva com medida de valor.", "Esquecer pagamentos diferidos.", "Confundir moeda com renda."], "Ao comparar pão, livro e passagem em reais, a moeda funciona como medida de valor.", [{ front: "Funções da moeda?", back: "Trocas, medida de valor, reserva de valor e pagamentos diferidos." }, { front: "Medida de valor?", back: "Permite comparar preços." }, { front: "Reserva de valor?", back: "Guarda poder de compra." }]),
  med("Taxa de juros", "A taxa de juros é o preço do dinheiro no tempo. Juros maiores encarecem crédito e tornam aplicações mais atrativas, reduzindo consumo e investimento. Juros menores barateiam crédito e estimulam consumo e investimento.", ["Juros simples: J = C × i × t", "Montante simples: M = C + J"], ["Use para crédito, consumo, investimento e inflação.", "Use juros altos para conter inflação.", "Use juros baixos para estimular demanda.", "Use juros simples em cálculo básico."], ["Achar que juros altos aumentam consumo.", "Achar que juros baixos combatem inflação de demanda.", "Confundir juros com inflação.", "Confundir investimento produtivo com aplicação financeira."], "Se juros sobem, uma empresa pode preferir aplicação financeira a máquinas quando o retorno produtivo esperado for menor.", [{ front: "Juros sobem: efeito?", back: "Crédito caro; consumo e investimento tendem a cair." }, { front: "Juros caem: efeito?", back: "Crédito barato; consumo e investimento tendem a subir." }, { front: "Juros altos combatem?", back: "Inflação de demanda." }]),
  med("PIB", "PIB é a soma dos bens e serviços finais produzidos dentro do território econômico de um país em determinado período. Pode ser analisado pela ótica da demanda, produção ou renda.", ["PIB = C + G + I + X - M", "PIB = ∑VAB + (Impostos - Subsídios)"], ["Use para produção total de bens e serviços finais.", "Use demanda com consumo, governo, investimento, exportações e importações.", "Use produção com valor adicionado bruto.", "Use crescimento do PIB para atividade econômica."], ["Contar bens intermediários.", "Confundir PIB com renda individual.", "Esquecer que importações subtraem.", "Esquecer que PIB considera produção no território.", "Confundir PIB nominal e real."], "C=500, G=200, I=150, X=100 e M=80. PIB = 500+200+150+100-80 = 870.", [{ front: "O que é PIB?", back: "Soma de bens e serviços finais produzidos no território." }, { front: "PIB pela demanda?", back: "PIB = C + G + I + X - M." }, { front: "Importação?", back: "Subtrai." }]),
  med("Oferta e demanda", "A demanda mostra quanto consumidores desejam comprar a cada preço e costuma ter inclinação negativa. A oferta mostra quanto produtores desejam vender e costuma ter inclinação positiva. O equilíbrio ocorre onde oferta e demanda se encontram.", [], ["Use demanda para consumidores e quantidade comprada.", "Use oferta para produtores e quantidade vendida.", "Use ceteris paribus quando outros fatores ficam constantes.", "Use equilíbrio quando oferta e demanda se igualam."], ["Confundir demanda com quantidade demandada.", "Confundir oferta com quantidade ofertada.", "Achar que demanda tem inclinação positiva.", "Achar que oferta tem inclinação negativa.", "Confundir deslocamento da curva com movimento ao longo da curva."], "Se o preço cai e os demais fatores ficam constantes, a quantidade demandada aumenta ao longo da curva.", [{ front: "Inclinação da demanda?", back: "Negativa." }, { front: "Inclinação da oferta?", back: "Positiva." }, { front: "Equilíbrio?", back: "Quantidade ofertada igual à demandada." }]),
  med("Elasticidade", "Elasticidade mede a sensibilidade de uma variável econômica diante da mudança de outra. Pode medir resposta da demanda ao preço, da oferta ao preço ou da demanda à renda.", ["Elasticidade-preço da demanda = %ΔQd / %ΔP", "Elasticidade-preço da oferta = %ΔQo / %ΔP", "Elasticidade-renda = %ΔQd / %ΔRenda"], ["Use demanda quando preço afeta quantidade demandada.", "Use oferta quando preço afeta quantidade ofertada.", "Use renda quando renda afeta consumo.", "Elástica: módulo maior que 1.", "Inelástica: módulo menor que 1.", "Unitária: módulo igual a 1."], ["Esquecer variação percentual.", "Ignorar sinal negativo da demanda.", "Confundir oferta com demanda.", "Confundir bem inferior e normal.", "Classificar elástico/inelástico errado."], "Se Qd aumenta 20% quando preço cai 10%, E = 20% / -10% = -2; em módulo, 2 > 1, demanda elástica.", [{ front: "O que mede elasticidade?", back: "Sensibilidade de uma variável a outra." }, { front: "Demanda elástica?", back: "Módulo maior que 1." }, { front: "Demanda inelástica?", back: "Módulo menor que 1." }]),
  med("Comportamento do consumidor", "A teoria do consumidor estuda como pessoas escolhem bens considerando preferências e restrição orçamentária. O consumidor busca maximizar satisfação, limitado por renda e preços.", ["Renda = Px × Qx + Py × Qy"], ["Use para escolhas, preferências e utilidade.", "Use cesta de mercado para combinações de bens.", "Use restrição orçamentária para renda limitada.", "Use curva de indiferença para mesmo nível de satisfação."], ["Achar que preferência sozinha determina escolha.", "Esquecer que orçamento limita consumo.", "Confundir indiferença com demanda.", "Achar que qualquer cesta desejada pode ser consumida.", "Esquecer que a cesta ótima respeita o orçamento."], "Uma cesta acima da linha orçamentária pode ser desejada, mas não é acessível com a renda disponível.", [{ front: "Cesta de mercado?", back: "Conjunto de uma ou mais mercadorias." }, { front: "Curva de indiferença?", back: "Cestas com mesmo nível de satisfação." }, { front: "O que limita escolha?", back: "Restrição orçamentária." }]),
  med("Fluxo circular da renda", "O fluxo circular da renda mostra relações entre famílias e empresas. Famílias fornecem fatores produtivos e recebem remuneração; empresas produzem bens e serviços comprados pelas famílias.", [], ["Use quando falar de famílias, empresas, consumo, remuneração e fatores produtivos.", "Use agentes econômicos para famílias, empresas, governo, setor externo e intermediários.", "Use mercado financeiro para poupança, investimento e financiamento."], ["Confundir papel das famílias e empresas.", "Achar que famílias apenas consomem.", "Esquecer que famílias fornecem fatores.", "Esquecer que empresas demandam fatores e ofertam bens.", "Confundir fluxo real com monetário."], "Uma família trabalha para uma empresa, recebe salário e compra bens produzidos por empresas. Esse ciclo representa o fluxo circular.", [{ front: "Famílias fornecem?", back: "Fatores produtivos, como trabalho e capital." }, { front: "Empresas fornecem?", back: "Bens e serviços." }, { front: "Famílias recebem?", back: "Salários, lucros, aluguéis e juros." }]),
];

type RawQuestion = [string, string, Question["difficulty"], string, string[], string, string, string, string?];
const rawQuestions: RawQuestion[] = [
["eco-prova-001","Inflação","easy","A inflação pode ser definida como:",["aumento isolado no preço de um produto específico","queda permanente no nível geral de preços","aumento constante e generalizado do nível de preços","redução do consumo das famílias","aumento da produção industrial"],"aumento constante e generalizado do nível de preços","Inflação ocorre quando há aumento persistente e generalizado dos preços, não apenas quando um produto específico fica mais caro.","Pense no comportamento do nível geral de preços."],
["eco-prova-002","Inflação","easy","Quando ocorre queda sustentada no nível geral de preços, tem-se:",["inflação de demanda","deflação","inflação inercial","hiperinflação","política monetária expansionista"],"deflação","Deflação é uma queda sustentada no nível geral de preços.","É o oposto de inflação."],
["eco-prova-003","Inflação","medium","Um produto custava R$ 80,00 e passou a custar R$ 100,00. Qual foi a variação percentual do preço?",["10%","20%","25%","30%","40%"],"25%","A variação percentual é ((100 - 80) / 80) × 100 = 25%.","Use preço novo menos preço antigo, dividido pelo preço antigo.","Taxa = ((P atual - P anterior) / P anterior) × 100"],
["eco-prova-004","Inflação","medium","A inflação reduz o poder de compra da moeda porque:",["aumenta a quantidade de bens disponíveis","faz com que a mesma quantidade de dinheiro compre menos bens e serviços","elimina a necessidade de moeda","aumenta automaticamente os salários reais","reduz todos os preços da economia"],"faz com que a mesma quantidade de dinheiro compre menos bens e serviços","Com preços mais altos, a mesma renda compra menos produtos, reduzindo o poder de compra.","Pense no que acontece com R$ 100 quando tudo fica mais caro."],
["eco-prova-005","Inflação","hard","Uma economia apresenta aumento persistente nos preços de alimentos, transporte, aluguel e serviços. Qual característica permite classificar esse fenômeno como inflação?",["o aumento ocorreu em apenas um setor","os preços subiram de forma generalizada e persistente","houve queda do consumo","houve apenas aumento salarial","a moeda deixou de existir"],"os preços subiram de forma generalizada e persistente","Para ser inflação, o aumento precisa ser generalizado e constante, afetando o nível geral de preços.","A palavra-chave é nível geral de preços."],
["eco-prova-006","Inflação","easy","A taxa de inflação expressa:",["o total de bens produzidos no país","o percentual de aumento do nível geral de preços","a taxa de desemprego","o volume de exportações","o lucro das empresas"],"o percentual de aumento do nível geral de preços","A taxa de inflação mede quanto o nível geral de preços aumentou em termos percentuais.","É uma medida percentual."],
["eco-prova-007","Tipos de inflação","easy","A inflação de demanda ocorre quando:",["os custos de produção caem","a demanda cresce mais rápido que a capacidade produtiva","o governo congela preços","há queda nos salários","a oferta aumenta mais que o consumo"],"a demanda cresce mais rápido que a capacidade produtiva","A inflação de demanda surge quando a procura por bens e serviços supera a capacidade de oferta da economia.","Demanda maior que oferta."],
["eco-prova-008","Tipos de inflação","easy","Se o preço do petróleo sobe muito e encarece transporte e produção, o tipo de inflação associado é:",["inflação de demanda","inflação de custos","deflação","inflação reprimida","inflação cambial neutra"],"inflação de custos","A inflação de custos ocorre quando o aumento dos custos de produção é repassado aos preços finais.","Petróleo, transporte e insumos são custos."],
["eco-prova-009","Tipos de inflação","medium","Contratos de aluguel e salários reajustados automaticamente pela inflação passada podem gerar:",["inflação inercial","inflação de demanda","deflação","queda generalizada de preços","aumento do PIB real"],"inflação inercial","A inflação inercial ocorre quando reajustes baseados na inflação passada mantêm a inflação elevada.","Pense em indexação."],
["eco-prova-010","Tipos de inflação","medium","Problemas logísticos, baixa produtividade e infraestrutura ruim podem causar:",["inflação estrutural","inflação reprimida apenas","deflação","aumento da oferta sem aumento de preços","política fiscal neutra"],"inflação estrutural","A inflação estrutural está associada a gargalos e ineficiências da economia.","A palavra-chave é estrutura da economia."],
["eco-prova-011","Tipos de inflação","hard","O governo congela preços artificialmente, mas os custos continuam subindo. Quando o controle acaba, os preços sobem rapidamente. Esse caso se aproxima de:",["inflação reprimida","inflação de demanda pura","elasticidade-preço","deflação estrutural","PIB nominal"],"inflação reprimida","A inflação reprimida ocorre quando aumentos são contidos artificialmente, mas depois aparecem de forma acumulada.","Os preços estavam sendo segurados."],
["eco-prova-012","Tipos de inflação","hard","Uma economia apresenta aumento de renda, expansão do crédito e consumo elevado, mas a produção não cresce no mesmo ritmo. O tipo de inflação mais provável é:",["inflação de demanda","inflação de custos","inflação estrutural causada apenas por logística","deflação","inflação reprimida"],"inflação de demanda","O cenário descreve excesso de demanda em relação à capacidade produtiva.","A demanda está crescendo mais que a oferta."],
["eco-prova-013","Política monetária","easy","A política monetária é conduzida principalmente por qual instituição?",["famílias","empresas privadas","Banco Central","sindicatos","consumidores"],"Banco Central","O Banco Central conduz a política monetária, controlando moeda, juros e crédito.","Pense na autoridade monetária."],
["eco-prova-014","Política monetária","easy","Uma política monetária expansionista tende a:",["reduzir a oferta de moeda e aumentar juros","aumentar a oferta de moeda e reduzir juros","congelar preços diretamente","eliminar o consumo das famílias","reduzir o PIB automaticamente"],"aumentar a oferta de moeda e reduzir juros","A política expansionista aumenta a oferta de moeda, o que tende a reduzir juros e estimular demanda.","Expansionista expande moeda."],
["eco-prova-015","Política monetária","easy","Uma política monetária contracionista tende a:",["aumentar a oferta de moeda","reduzir a taxa de juros","reduzir a oferta de moeda e elevar juros","aumentar diretamente a produção agrícola","eliminar a inflação inercial sem custo"],"reduzir a oferta de moeda e elevar juros","A política contracionista reduz a oferta de moeda, elevando juros e desaquecendo a demanda.","Contracionista contrai moeda."],
["eco-prova-016","Taxa de juros","medium","Quando a taxa de juros aumenta, espera-se que:",["o crédito fique mais barato","o consumo financiado aumente automaticamente","o investimento produtivo possa diminuir","todos os preços caiam imediatamente","a moeda perca todas as funções"],"o investimento produtivo possa diminuir","Juros mais altos encarecem o crédito e tornam aplicações financeiras mais atrativas, podendo reduzir investimento produtivo.","Pense no custo do crédito."],
["eco-prova-017","Política monetária","medium","Se a inflação está alta por excesso de demanda, uma medida monetária adequada seria:",["reduzir juros para estimular o consumo","aumentar juros para conter consumo e investimento","aumentar a oferta de moeda","reduzir compulsoriamente todos os preços","elevar importações no cálculo do PIB"],"aumentar juros para conter consumo e investimento","Juros maiores encarecem o crédito e reduzem a demanda agregada, ajudando a conter inflação de demanda.","Inflação alta geralmente pede política contracionista."],
["eco-prova-018","Moeda e funções da moeda","easy","A moeda usada para comparar o preço de diferentes produtos exerce a função de:",["reserva de valor","medida de valor","inflação inercial","oferta agregada","bem intermediário"],"medida de valor","Como medida de valor, a moeda permite comparar preços de bens e serviços.","É uma unidade comum de comparação."],
["eco-prova-019","Moeda e funções da moeda","medium","Quando a moeda é usada para guardar riqueza ao longo do tempo, ela exerce a função de:",["intermediária de trocas","medida de valor","reserva de valor","curva de demanda","elasticidade-renda"],"reserva de valor","A moeda funciona como reserva de valor quando preserva poder de compra para uso futuro.","Guardar para usar depois."],
["eco-prova-020","Moeda e funções da moeda","hard","A função da moeda que permite compras e vendas sem necessidade de escambo é:",["intermediária de trocas","inflação de custos","reserva internacional","taxa real de juros","restrição orçamentária"],"intermediária de trocas","A moeda como intermediária de trocas facilita transações, substituindo a troca direta de bens.","Ela facilita a troca."],
["eco-prova-021","PIB","easy","PIB significa:",["Produto Interno Bruto","Preço Interno Básico","Produto Industrial Brasileiro","Política Interna Bancária","Pagamento Interno Bruto"],"Produto Interno Bruto","PIB é o Produto Interno Bruto, indicador da produção de bens e serviços finais em um território.","É a sigla mais usada para produção total do país."],
["eco-prova-022","PIB","easy","O PIB considera principalmente:",["apenas bens usados","bens e serviços finais produzidos no território econômico","apenas importações","apenas salários do setor público","apenas produtos intermediários"],"bens e serviços finais produzidos no território econômico","O PIB soma bens e serviços finais produzidos dentro do território econômico.","Cuidado com bens intermediários."],
["eco-prova-023","PIB pela ótica da demanda","medium","Na ótica da demanda, a fórmula correta do PIB é:",["PIB = C + G + I + X - M","PIB = C - G - I - X + M","PIB = X + M - C","PIB = salários + juros apenas","PIB = preço × quantidade demandada"],"PIB = C + G + I + X - M","Pela ótica da demanda, o PIB é consumo privado + gasto público + investimento + exportações - importações.","Importações subtraem.","PIB = C + G + I + X - M"],
["eco-prova-024","PIB pela ótica da demanda","medium","Considere C = 400, G = 150, I = 100, X = 80 e M = 30. O PIB pela ótica da demanda é:",["500","600","700","730","760"],"700","PIB = C + G + I + X - M = 400 + 150 + 100 + 80 - 30 = 700.","Some C, G, I e X; subtraia M.","PIB = C + G + I + X - M"],
["eco-prova-025","PIB pela ótica da produção","hard","Na ótica da produção, o PIB pode ser obtido a partir:",["da soma dos valores adicionados pelas empresas, ajustada por impostos e subsídios","apenas da renda das famílias","apenas do consumo público","da soma dos bens intermediários","da inflação acumulada"],"da soma dos valores adicionados pelas empresas, ajustada por impostos e subsídios","Pela ótica da produção, considera-se o valor adicionado bruto, com ajuste de impostos líquidos de subsídios.","Pense em valor adicionado bruto."],
["eco-prova-026","Oferta e demanda","easy","A curva de demanda normalmente possui inclinação:",["positiva","negativa","vertical sempre","horizontal sempre","nula"],"negativa","A demanda geralmente tem inclinação negativa: preços menores levam a maior quantidade demandada.","Preço cai, consumo tende a subir."],
["eco-prova-027","Oferta e demanda","easy","A curva de oferta normalmente possui inclinação:",["negativa","positiva","sempre horizontal","sempre vertical","aleatória"],"positiva","A oferta tende a aumentar quando o preço sobe, por isso a curva é positivamente inclinada.","Preço maior estimula produção."],
["eco-prova-028","Equilíbrio de mercado","medium","O ponto de equilíbrio de mercado ocorre quando:",["o preço é zero","a quantidade ofertada é igual à quantidade demandada","a oferta desaparece","a demanda é sempre maior que a oferta","o governo fixa todos os preços"],"a quantidade ofertada é igual à quantidade demandada","No equilíbrio, a quantidade que produtores querem vender é igual à quantidade que consumidores querem comprar.","Oferta = demanda."],
["eco-prova-029","Oferta e demanda","medium","Mantidos os demais fatores constantes, uma queda no preço de um bem tende a causar:",["queda na quantidade demandada","aumento na quantidade demandada","desaparecimento da demanda","deslocamento obrigatório da oferta","aumento automático dos custos"],"aumento na quantidade demandada","Pela lei da demanda, quando o preço cai, a quantidade demandada tende a aumentar.","Lei da demanda."],
["eco-prova-030","Equilíbrio de mercado","hard","Se o preço de mercado está acima do preço de equilíbrio, é provável que ocorra:",["excesso de demanda","escassez","excesso de oferta","equilíbrio imediato","desaparecimento da oferta"],"excesso de oferta","Preço acima do equilíbrio estimula produtores a ofertarem mais, enquanto consumidores demandam menos, gerando excedente.","Preço alto: produtores querem vender muito, consumidores compram pouco."],
["eco-prova-031","Elasticidade","easy","Elasticidade mede:",["a produção total do país","a sensibilidade de uma variável a mudanças em outra","apenas o valor da moeda","a soma de exportações e importações","o nível de desemprego"],"a sensibilidade de uma variável a mudanças em outra","Elasticidade mede a reação de uma variável econômica diante de alterações em outra.","É uma medida de resposta."],
["eco-prova-032","Elasticidade","medium","Se a quantidade demandada varia 20% quando o preço varia 10%, o módulo da elasticidade-preço da demanda é:",["0,2","0,5","1","2","10"],"2","Elasticidade = 20% / 10% = 2. Em módulo, a demanda é elástica.","Divida a variação percentual da quantidade pela variação percentual do preço.","E = %ΔQ / %ΔP"],
["eco-prova-033","Elasticidade","medium","Uma demanda é considerada inelástica quando:",["o módulo da elasticidade é maior que 1","o módulo da elasticidade é menor que 1","a elasticidade é sempre zero","a quantidade não existe","o preço não muda"],"o módulo da elasticidade é menor que 1","Demanda inelástica significa que a quantidade reage proporcionalmente menos que o preço.","Pouca resposta da quantidade."],
["eco-prova-034","Elasticidade","hard","Se a renda aumenta e a quantidade demandada de um bem diminui, esse bem é classificado como:",["bem normal","bem inferior","bem de luxo obrigatoriamente","bem público","bem intermediário"],"bem inferior","Quando a renda aumenta e a demanda cai, o bem é inferior.","A relação entre renda e demanda é inversa."],
["eco-prova-035","Elasticidade","hard","A elasticidade-preço da oferta relaciona:",["variação da quantidade ofertada e variação do preço","variação da renda e variação da demanda","variação do PIB e variação da inflação","variação da moeda e variação do consumo apenas","variação das importações e exportações"],"variação da quantidade ofertada e variação do preço","A elasticidade-preço da oferta mede como a quantidade ofertada reage à variação do preço.","Oferta responde ao preço."],
["eco-prova-036","Comportamento do consumidor","easy","Uma cesta de mercado é:",["apenas uma curva de oferta","um conjunto de uma ou mais mercadorias","a taxa de juros do Banco Central","o total de impostos arrecadados","o PIB pela ótica da produção"],"um conjunto de uma ou mais mercadorias","Cesta de mercado é uma combinação de bens escolhidos ou comparados pelo consumidor.","Pense em combinação de bens."],
["eco-prova-037","Curvas de indiferença","medium","Uma curva de indiferença representa:",["combinações de bens com mesmo nível de satisfação","apenas preços de mercado","custos de produção","taxa de inflação","quantidade ofertada pelas empresas"],"combinações de bens com mesmo nível de satisfação","A curva de indiferença reúne cestas que proporcionam igual utilidade ao consumidor.","Indiferença significa mesma satisfação."],
["eco-prova-038","Restrição orçamentária","medium","A restrição orçamentária mostra:",["todas as combinações desejadas sem limite de renda","as combinações possíveis de consumo dada a renda e os preços","apenas a curva de oferta","a política monetária do Banco Central","a inflação de custos"],"as combinações possíveis de consumo dada a renda e os preços","A restrição orçamentária limita as escolhas do consumidor de acordo com renda e preços.","Orçamento limita escolhas."],
["eco-prova-039","Fluxo circular da renda","easy","No fluxo circular da renda, as famílias:",["apenas produzem bens finais","fornecem fatores produtivos e consomem bens e serviços","controlam a política monetária","são sempre exportadoras","definem sozinhas o preço de equilíbrio"],"fornecem fatores produtivos e consomem bens e serviços","As famílias oferecem fatores como trabalho e capital e demandam bens e serviços.","Famílias trabalham e consomem."],
["eco-prova-040","Agentes econômicos","medium","São exemplos de agentes econômicos:",["apenas famílias e empresas","famílias, empresas, governo, intermediários financeiros e setor externo","apenas o Banco Central","apenas consumidores","apenas exportadores"],"famílias, empresas, governo, intermediários financeiros e setor externo","Os agentes econômicos incluem famílias, empresas, governo, intermediários financeiros e setor externo.","Pense nos principais grupos que atuam na economia."],
];

export const economyExamQuestions: Question[] = rawQuestions.map(([id, topic, difficulty, statement, alternatives, correctAnswer, explanation, hint, relatedFormula]) => ({
  id,
  subject: "Economia",
  topic,
  difficulty,
  statement,
  alternatives,
  correctAnswer,
  explanation,
  hint,
  relatedFormula: relatedFormula || "",
  tags: ["Economia", "Prova de Economia", topic],
  createdAt: stamp,
  updatedAt: stamp,
}));

export function buildEconomyExam(patients: Patient[], baseDate = new Date()): Exam {
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weights: Record<number, string[]> = {
    5: ["Inflação", "Tipos de inflação", "Política monetária", "PIB", "Oferta e demanda"],
    4: ["Taxa de juros", "Moeda e funções da moeda", "PIB pela ótica da demanda", "Equilíbrio de mercado", "Elasticidade"],
    3: ["Comportamento do consumidor", "Curvas de indiferença", "Restrição orçamentária", "Fluxo circular da renda", "Agentes econômicos"],
    2: ["Poupança e investimento", "Mercado financeiro"],
  };
  const topics: ExamTopic[] = Object.entries(weights).flatMap(([weight, names]) => names.map((name) => {
    const patient = patients.find((item) => item.subject === "Economia" && item.name === name) || economyExamPatients.find((item) => item.name === name)!;
    return { patientId: patient.id, topicName: name, subject: "Economia", weight: Number(weight) as ExamTopic["weight"] };
  }));
  return {
    id: "exam-economia-engenharia",
    title: "Prova de Economia",
    subject: "Economia",
    date: tomorrow.toISOString().slice(0, 10),
    description: "Prova de Economia da Engenharia com conteúdos de microeconomia e macroeconomia: inflação, política monetária, PIB, oferta e demanda, elasticidade, comportamento do consumidor e fluxo circular da renda.",
    priority: "urgent",
    topics,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

export function buildEconomyIntensivePlan(exam: Exam, patients: Patient[], baseDate = new Date()): DailyStudyPlanItem[] {
  const today = baseDate.toISOString().slice(0, 10);
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);
  const byName = (name: string) => patients.find((patient) => patient.subject === "Economia" && patient.name === name) || economyExamPatients.find((patient) => patient.name === name)!;
  const todayTasks = [
    ["Inflação", "study_theory", "Tema central da prova e base para entender política monetária.", 260],
    ["Tipos de inflação", "study_theory", "Tema com muitas classificações conceituais e pegadinhas.", 255],
    ["Política monetária", "study_theory", "Tema conectado com inflação, juros e Banco Central.", 250],
    ["PIB", "questions", "Tema com fórmula provável de prova: PIB = C + G + I + X - M.", 240],
    ["Oferta e demanda", "questions", "Tema clássico de microeconomia, com curvas e ponto de equilíbrio.", 230],
    ["Elasticidade", "questions", "Tema com cálculo e interpretação.", 220],
  ] as const;
  const tomorrowTasks = [
    ["Inflação", "final_review", "Revisão final antes da prova de Economia.", 245],
    ["Política monetária", "final_review", "Revisão final antes da prova de Economia.", 240],
    ["PIB", "final_review", "Revisão final da fórmula PIB = C + G + I + X - M.", 235],
    ["Oferta e demanda", "final_review", "Revisão final de curvas, movimentos e equilíbrio.", 230],
    ["Elasticidade", "final_review", "Revisão rápida de elasticidade, cálculo e interpretação.", 225],
  ] as const;
  return [...todayTasks.map(([topicName, actionType, reason, priorityScore], index) => {
    const patient = byName(topicName);
    return { id: `eco-intensive-today-${index + 1}`, date: today, examId: exam.id, patientId: patient.id, topicName, subject: "Economia", actionType, reason, priorityScore, completed: false };
  }), ...tomorrowTasks.map(([topicName, actionType, reason, priorityScore], index) => {
    const patient = byName(topicName);
    return { id: `eco-intensive-tomorrow-${index + 1}`, date: tomorrowIso, examId: exam.id, patientId: patient.id, topicName, subject: "Economia", actionType, reason, priorityScore, completed: false };
  })] as DailyStudyPlanItem[];
}
