import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results = {
    ganchos: { inserted: 0, errors: [] as string[] },
    ctas: { inserted: 0, errors: [] as string[] },
    hashtags: { inserted: 0, errors: [] as string[] },
    legendas: { inserted: 0, errors: [] as string[] }
  };

  // ============================================
  // GANCHOS (40+ hooks variados)
  // ============================================
  const ganchosReais = [
    // CURIOSIDADE
    { texto: "Voce sabia que 90% dos homens sofrem com isso?", tipo_gancho: "curiosidade", tipo_post: "reel", pilar: "intimax", objetivo: "autoridade" },
    { texto: "O que ninguem te conta sobre harmonizacao facial...", tipo_gancho: "revelacao", tipo_post: "reel", pilar: "fullface", objetivo: "autoridade" },
    { texto: "3 erros que voce comete TODO dia com a pele", tipo_gancho: "erro", tipo_post: "carrossel", pilar: "fullface", objetivo: "educativo" },
    { texto: "Medicos nao querem que voce saiba disso...", tipo_gancho: "segredo", tipo_post: "reel", pilar: "intimax", objetivo: "autoridade" },
    { texto: "Isso muda TUDO que voce sabe sobre estetica", tipo_gancho: "revelacao", tipo_post: "reel", pilar: "geral", objetivo: "viral" },

    // MITO VS VERDADE
    { texto: "MITO: Harmonizacao facial doi muito", tipo_gancho: "mito", tipo_post: "carrossel", pilar: "fullface", objetivo: "educativo" },
    { texto: "MITO: Resultado fica artificial", tipo_gancho: "mito", tipo_post: "carrossel", pilar: "fullface", objetivo: "educativo" },
    { texto: "MITO: Qualquer um pode fazer procedimento", tipo_gancho: "mito", tipo_post: "carrossel", pilar: "intimax", objetivo: "autoridade" },
    { texto: "MITO: Gluteoplastia e proibida", tipo_gancho: "mito", tipo_post: "carrossel", pilar: "gluteos", objetivo: "educativo" },
    { texto: "MITO: Resultado nao dura nada", tipo_gancho: "mito", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },

    // PROVA SOCIAL
    { texto: "Paciente chegou aqui assim...", tipo_gancho: "transformacao", tipo_post: "reel", pilar: "gluteos", objetivo: "prova_social" },
    { texto: "Antes e depois: 30 dias de transformacao", tipo_gancho: "transformacao", tipo_post: "carrossel", pilar: "fullface", objetivo: "prova_social" },
    { texto: "Resultado real de paciente real", tipo_gancho: "transformacao", tipo_post: "reel", pilar: "intimax", objetivo: "prova_social" },
    { texto: "Veja a evolucao dela em 60 dias", tipo_gancho: "transformacao", tipo_post: "reel", pilar: "gluteos", objetivo: "prova_social" },
    { texto: "Pacientes compartilham resultados", tipo_gancho: "transformacao", tipo_post: "carrossel", pilar: "geral", objetivo: "prova_social" },

    // EDUCATIVO
    { texto: "5 coisas que voce precisa saber antes", tipo_gancho: "lista", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },
    { texto: "Checklist completo antes do procedimento", tipo_gancho: "lista", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },
    { texto: "Passo a passo do procedimento explicado", tipo_gancho: "tutorial", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },
    { texto: "Como cuidar do resultado apos o procedimento", tipo_gancho: "tutorial", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },
    { texto: "Duvidas mais frequentes respondidas", tipo_gancho: "faq", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },

    // CONVERSAO
    { texto: "Ultima vaga disponivel esta semana!", tipo_gancho: "urgencia", tipo_post: "stories", pilar: "geral", objetivo: "conversao" },
    { texto: "Condicao especial VALIDA SOMENTE ate sexta", tipo_gancho: "urgencia", tipo_post: "stories", pilar: "geral", objetivo: "conversao" },
    { texto: "Resultado garantido OU seu dinheiro de volta", tipo_gancho: "garantia", tipo_post: "reel", pilar: "intimax", objetivo: "conversao" },
    { texto: "Parcele em ate 12x no seu cartao", tipo_gancho: "oferta", tipo_post: "stories", pilar: "geral", objetivo: "conversao" },
    { texto: "Agende agora e ganhe consultoria gratis", tipo_gancho: "bonus", tipo_post: "reel", pilar: "geral", objetivo: "conversao" },

    // ENGAJAMENTO
    { texto: "Conta pra mim nos comentarios...", tipo_gancho: "pergunta", tipo_post: "reel", pilar: "geral", objetivo: "engajamento" },
    { texto: "Voce concorda com isso?", tipo_gancho: "pergunta", tipo_post: "stories", pilar: "geral", objetivo: "engajamento" },
    { texto: "Qual sua maior duvida sobre este procedimento?", tipo_gancho: "pergunta", tipo_post: "stories", pilar: "geral", objetivo: "engajamento" },
    { texto: "Salva esse post pra nao esquecer!", tipo_gancho: "acao", tipo_post: "carrossel", pilar: "geral", objetivo: "engajamento" },
    { texto: "Marca aqui quem precisa ver isso", tipo_gancho: "acao", tipo_post: "reel", pilar: "geral", objetivo: "engajamento" },

    // POV
    { texto: "POV: Voce descobriu a solucao definitiva", tipo_gancho: "pov", tipo_post: "reel", pilar: "intimax", objetivo: "viral" },
    { texto: "POV: Voce finalmente tem confianca de novo", tipo_gancho: "pov", tipo_post: "reel", pilar: "geral", objetivo: "viral" },
  ];

  // ============================================
  // CTAs (50+ call-to-actions)
  // ============================================
  const ctasReais = [
    // ENGAJAMENTO
    { texto: "Comenta se voce se identificou!", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Salva esse post para nao esquecer!", categoria: "engajamento", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Marca aqui quem precisa ver isso", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Compartilha nos stories e me marca!", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Deixa um coracaozinho se voce concorda", categoria: "engajamento", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Comenta SIM se quer mais conteudo assim", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Qual foi sua maior descoberta? Conta ai!", categoria: "engajamento", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Me segue pra mais dicas como essa", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Ativa o sininho para nao perder nada!", categoria: "engajamento", tipo_post: "reel", pilar: "geral" },
    { texto: "Envia pra alguem que precisa ver isso", categoria: "engajamento", tipo_post: "stories", pilar: "geral" },

    // CONVERSAO
    { texto: "Clique no link da bio e agende sua avaliacao", categoria: "conversao", tipo_post: "reel", pilar: "geral" },
    { texto: "Chama no WhatsApp: link na bio!", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "Agende sua consulta gratuita HOJE", categoria: "conversao", tipo_post: "reel", pilar: "geral" },
    { texto: "Vagas limitadas - garanta a sua!", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "Responde esse story com QUERO", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "DM aberta para duvidas!", categoria: "conversao", tipo_post: "reel", pilar: "geral" },
    { texto: "Parcele em ate 12x - condicoes na bio", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "Ultimas 3 vagas do mes!", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "Promocao valida so ate amanha", categoria: "conversao", tipo_post: "stories", pilar: "geral" },
    { texto: "Primeira consulta com 50% OFF - link na bio", categoria: "conversao", tipo_post: "reel", pilar: "geral" },

    // AUTORIDADE
    { texto: "Segue a gente para mais conteudo de qualidade", categoria: "autoridade", tipo_post: "reel", pilar: "geral" },
    { texto: "Dra. Karina - especialista em harmonizacao", categoria: "autoridade", tipo_post: "reel", pilar: "fullface" },
    { texto: "+500 procedimentos realizados com sucesso", categoria: "autoridade", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Referencia em Intimax no Brasil", categoria: "autoridade", tipo_post: "reel", pilar: "intimax" },
    { texto: "Formacao internacional - Miami, EUA", categoria: "autoridade", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Membro da Sociedade Brasileira de Medicina Estetica", categoria: "autoridade", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Tecnica exclusiva desenvolvida pela Dra. Karina", categoria: "autoridade", tipo_post: "reel", pilar: "geral" },
    { texto: "10+ anos de experiencia em estetica avancada", categoria: "autoridade", tipo_post: "carrossel", pilar: "geral" },

    // EDUCATIVO
    { texto: "Quer aprender mais? Segue a gente!", categoria: "educativo", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Salva esse carrossel para consultar depois", categoria: "educativo", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Ficou com duvida? Pergunta nos comentarios!", categoria: "educativo", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Parte 2 amanha - ativa as notificacoes!", categoria: "educativo", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Material completo no link da bio", categoria: "educativo", tipo_post: "carrossel", pilar: "geral" },

    // URGENCIA
    { texto: "So ate domingo!", categoria: "urgencia", tipo_post: "stories", pilar: "geral" },
    { texto: "ULTIMA CHANCE do mes!", categoria: "urgencia", tipo_post: "stories", pilar: "geral" },
    { texto: "Faltam 24h para acabar!", categoria: "urgencia", tipo_post: "stories", pilar: "geral" },
    { texto: "Vagas esgotando!", categoria: "urgencia", tipo_post: "stories", pilar: "geral" },
    { texto: "Nao perca essa oportunidade unica", categoria: "urgencia", tipo_post: "reel", pilar: "geral" },

    // PROVA SOCIAL
    { texto: "Veja mais resultados no nosso perfil!", categoria: "prova_social", tipo_post: "reel", pilar: "geral" },
    { texto: "Mais de 1000 pacientes satisfeitos", categoria: "prova_social", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Resultado de paciente real - sem filtro", categoria: "prova_social", tipo_post: "reel", pilar: "geral" },
    { texto: "Nota 5.0 no Google - confira!", categoria: "prova_social", tipo_post: "carrossel", pilar: "geral" },
    { texto: "Depoimentos reais nos destaques", categoria: "prova_social", tipo_post: "stories", pilar: "geral" },
  ];

  // ============================================
  // HASHTAGS (70+ variadas)
  // ============================================
  const hashtagsReais = [
    // AUTORIDADE
    { texto: "#drakarinarodovansky", tema: "autoridade", volume: 50000, tipo_post: "reel" },
    { texto: "#institutorodovansky", tema: "autoridade", volume: 30000, tipo_post: "carrossel" },
    { texto: "#especialistaemestetica", tema: "autoridade", volume: 100000, tipo_post: "reel" },
    { texto: "#medicaestetica", tema: "autoridade", volume: 500000, tipo_post: "reel" },
    { texto: "#medicinaesteticaavancada", tema: "autoridade", volume: 80000, tipo_post: "reel" },
    { texto: "#dermatologista", tema: "autoridade", volume: 2000000, tipo_post: "reel" },

    // PROCEDIMENTO - INTIMAX
    { texto: "#intimax", tema: "procedimento", volume: 10000, tipo_post: "reel" },
    { texto: "#harmonizacaointima", tema: "procedimento", volume: 50000, tipo_post: "reel" },
    { texto: "#saudemasculina", tema: "procedimento", volume: 200000, tipo_post: "reel" },
    { texto: "#bemestarmasculino", tema: "procedimento", volume: 80000, tipo_post: "reel" },
    { texto: "#procedimentomasculino", tema: "procedimento", volume: 30000, tipo_post: "reel" },
    { texto: "#autoestimahomem", tema: "procedimento", volume: 40000, tipo_post: "reel" },

    // PROCEDIMENTO - FULLFACE
    { texto: "#harmonizacaofacial", tema: "procedimento", volume: 2000000, tipo_post: "reel" },
    { texto: "#preenchimentolabial", tema: "procedimento", volume: 1500000, tipo_post: "reel" },
    { texto: "#rinomodelacao", tema: "procedimento", volume: 500000, tipo_post: "reel" },
    { texto: "#botox", tema: "procedimento", volume: 5000000, tipo_post: "reel" },
    { texto: "#skinbooster", tema: "procedimento", volume: 800000, tipo_post: "reel" },
    { texto: "#bioestimulador", tema: "procedimento", volume: 700000, tipo_post: "reel" },

    // PROCEDIMENTO - GLUTEOS
    { texto: "#gluteoplastia", tema: "procedimento", volume: 300000, tipo_post: "reel" },
    { texto: "#preenchimentogluteo", tema: "procedimento", volume: 100000, tipo_post: "reel" },
    { texto: "#bumbumperfeito", tema: "procedimento", volume: 500000, tipo_post: "reel" },
    { texto: "#gluteos", tema: "procedimento", volume: 1000000, tipo_post: "reel" },
    { texto: "#corpodossonhos", tema: "procedimento", volume: 800000, tipo_post: "reel" },

    // LOCAL
    { texto: "#curitiba", tema: "local", volume: 10000000, tipo_post: "reel" },
    { texto: "#cwb", tema: "local", volume: 5000000, tipo_post: "reel" },
    { texto: "#clinicacuritiba", tema: "local", volume: 100000, tipo_post: "reel" },
    { texto: "#esteticacuritiba", tema: "local", volume: 200000, tipo_post: "reel" },
    { texto: "#harmonizacaocuritiba", tema: "local", volume: 50000, tipo_post: "reel" },

    // BENEFICIO
    { texto: "#autoestima", tema: "beneficio", volume: 3000000, tipo_post: "reel" },
    { texto: "#autoconfianca", tema: "beneficio", volume: 1500000, tipo_post: "reel" },
    { texto: "#beleza", tema: "beneficio", volume: 50000000, tipo_post: "reel" },
    { texto: "#rejuvenescimento", tema: "beneficio", volume: 2000000, tipo_post: "reel" },
    { texto: "#resultadonatural", tema: "beneficio", volume: 500000, tipo_post: "reel" },
    { texto: "#antesedepois", tema: "beneficio", volume: 10000000, tipo_post: "carrossel" },
    { texto: "#transformacao", tema: "beneficio", volume: 5000000, tipo_post: "reel" },
    { texto: "#bemestar", tema: "beneficio", volume: 8000000, tipo_post: "reel" },

    // TRENDING
    { texto: "#viral", tema: "trending", volume: 100000000, tipo_post: "reel" },
    { texto: "#reels", tema: "trending", volume: 200000000, tipo_post: "reel" },
    { texto: "#reelsinstagram", tema: "trending", volume: 150000000, tipo_post: "reel" },
    { texto: "#trending", tema: "trending", volume: 80000000, tipo_post: "reel" },
    { texto: "#explore", tema: "trending", volume: 100000000, tipo_post: "reel" },
    { texto: "#dicasdebeleza", tema: "trending", volume: 5000000, tipo_post: "reel" },
    { texto: "#instareels", tema: "trending", volume: 30000000, tipo_post: "reel" },
    { texto: "#foryou", tema: "trending", volume: 500000000, tipo_post: "reel" },
  ];

  // ============================================
  // LEGENDAS (8+ variadas)
  // ============================================
  const legendasReais = [
    { texto: "Voce sabia que 90% dos homens tem alguma insatisfacao com a regiao intima? O Intimax e a solucao definitiva para quem busca mais confianca e satisfacao. Procedimento seguro, minimamente invasivo e com resultados que duram anos. Agende sua consulta e descubra como podemos te ajudar!", tipo_legenda: "educativo", tipo_post: "reel", pilar: "intimax", objetivo: "autoridade" },
    { texto: "Antes e depois que fala por si so! Resultado natural e harmonioso de harmonizacao facial. Cada detalhe pensado para realcar sua beleza unica. Quer saber mais? Link na bio!", tipo_legenda: "prova_social", tipo_post: "carrossel", pilar: "fullface", objetivo: "prova_social" },
    { texto: "5 MITOS sobre harmonizacao facial que voce precisa parar de acreditar AGORA:\n\n1. Fica artificial\n2. Doi muito\n3. Qualquer um pode fazer\n4. E so pra mulher\n5. Resultado some rapido\n\nSalva esse post e compartilha com quem precisa saber a VERDADE!", tipo_legenda: "educativo", tipo_post: "carrossel", pilar: "fullface", objetivo: "educativo" },
    { texto: "Ela chegou na clinica sem autoestima. Saiu radiante!\n\nIsso e o que mais me motiva: ver a transformacao nao so fisica, mas emocional de cada paciente.\n\nObrigada pela confianca!", tipo_legenda: "storytelling", tipo_post: "reel", pilar: "geral", objetivo: "prova_social" },
    { texto: "ULTIMA VAGA DO MES!\n\nQuem agendar avaliacao essa semana ganha condicao especial. Nao perca essa oportunidade!\n\nLink na bio ou chama no WhatsApp", tipo_legenda: "conversao", tipo_post: "stories", pilar: "geral", objetivo: "conversao" },
    { texto: "Checklist COMPLETO antes de fazer qualquer procedimento estetico:\n\nPesquisar o profissional\nVerificar registro no CRM\nConhecer a clinica\nFazer avaliacao presencial\nTirar TODAS as duvidas\nEntender os riscos\nTer expectativas realistas\n\nSalva esse post!", tipo_legenda: "educativo", tipo_post: "carrossel", pilar: "geral", objetivo: "educativo" },
    { texto: "POV: Voce descobriu que existe solucao para aquilo que te incomoda ha anos\n\nSim, existe. E e mais acessivel do que voce imagina.\n\nVem conversar comigo! DM aberta", tipo_legenda: "viral", tipo_post: "reel", pilar: "intimax", objetivo: "viral" },
    { texto: "Harmonizacao facial NAO e sobre mudar quem voce e.\n\nE sobre realcar o que voce ja tem de mais bonito.\n\nNa minha clinica, cada procedimento e personalizado para VOCE. Resultado natural sempre!", tipo_legenda: "autoridade", tipo_post: "reel", pilar: "fullface", objetivo: "autoridade" },
  ];

  try {
    // Insert Ganchos
    for (let i = 0; i < ganchosReais.length; i++) {
      const gancho = ganchosReais[i];
      const { error } = await supabase
        .from('ganchos')
        .upsert({
          id: `gancho_seed_${String(i + 1).padStart(3, '0')}`,
          texto: gancho.texto,
          tipo_gancho: gancho.tipo_gancho,
          tipo_post: gancho.tipo_post,
          pilar: gancho.pilar,
          objetivo: gancho.objetivo,
          ativo: true,
          uso_count: Math.floor(Math.random() * 100)
        }, { onConflict: 'id' });

      if (error) {
        results.ganchos.errors.push(`${i}: ${error.message}`);
      } else {
        results.ganchos.inserted++;
      }
    }

    // Insert CTAs
    for (let i = 0; i < ctasReais.length; i++) {
      const cta = ctasReais[i];
      const { error } = await supabase
        .from('ctas')
        .upsert({
          id: `cta_seed_${String(i + 1).padStart(3, '0')}`,
          texto: cta.texto,
          categoria: cta.categoria,
          tipo_post: cta.tipo_post,
          pilar: cta.pilar,
          ativo: true,
          uso_count: Math.floor(Math.random() * 50)
        }, { onConflict: 'id' });

      if (error) {
        results.ctas.errors.push(`${i}: ${error.message}`);
      } else {
        results.ctas.inserted++;
      }
    }

    // Insert Hashtags
    for (let i = 0; i < hashtagsReais.length; i++) {
      const hashtag = hashtagsReais[i];
      const { error } = await supabase
        .from('hashtags')
        .upsert({
          id: `hashtag_seed_${String(i + 1).padStart(3, '0')}`,
          texto: hashtag.texto,
          tema: hashtag.tema,
          volume: hashtag.volume,
          tipo_post: hashtag.tipo_post,
          ativo: true
        }, { onConflict: 'id' });

      if (error) {
        results.hashtags.errors.push(`${i}: ${error.message}`);
      } else {
        results.hashtags.inserted++;
      }
    }

    // Insert Legendas
    for (let i = 0; i < legendasReais.length; i++) {
      const legenda = legendasReais[i];
      const { error } = await supabase
        .from('legendas')
        .upsert({
          id: `legenda_seed_${String(i + 1).padStart(3, '0')}`,
          texto: legenda.texto,
          tipo_legenda: legenda.tipo_legenda,
          tipo_post: legenda.tipo_post,
          pilar: legenda.pilar,
          objetivo: legenda.objetivo,
          ativo: true,
          uso_count: Math.floor(Math.random() * 30)
        }, { onConflict: 'id' });

      if (error) {
        results.legendas.errors.push(`${i}: ${error.message}`);
      } else {
        results.legendas.inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed executado com sucesso!',
      results,
      totals: {
        ganchos: ganchosReais.length,
        ctas: ctasReais.length,
        hashtags: hashtagsReais.length,
        legendas: legendasReais.length
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para executar o seed',
    endpoint: '/api/seed/execute',
    usage: 'curl -X POST http://localhost:3000/api/seed/execute'
  });
}
