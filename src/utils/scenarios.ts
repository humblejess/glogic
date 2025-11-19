export interface Scenario {
  id: string;
  title: Record<string, string>;
  content: Record<string, string>;
  condition: (ranking: string[]) => boolean;
}

// Scenario selection logic
export function getScenarioForRanking(ranking: string[]): string {
  if (!ranking || ranking.length < 2) {
    return 'restroom-transman'; // Default scenario
  }
  
  const first = ranking[0];
  const second = ranking[1];
  
  // If option a or b is in top 2, show trans-man scenario
  if (first === 'a' || first === 'b' || second === 'a' || second === 'b') {
    return 'restroom-transman';
  }
  
  // Otherwise, show trans-woman scenario
  return 'restroom-transwoman';
}

// Scenario content library
export const scenarioLibrary: Record<string, Scenario> = {
  'restroom-transman': {
    id: 'restroom-transman',
    title: {
      'en': 'Public Restroom: Trans-man Scenario',
      'zh-CN': '公共卫生间：跨性别男性场景',
      'zh-TW': '公共衛生間：跨性別男性場景',
      'fr': 'Toilettes publiques : Scénario trans-homme',
      'es': 'Baño público: Escenario trans-hombre',
    },
    content: {
      'en': `Imagine you're leaving a public restroom and see a transgender man (trans-man):
- He has a full beard
- Deep voice
- Completely masculine appearance
- But he hasn't had bottom surgery (pre bottom SRS)

According to your ranking choice, if you put option A (DNA/chromosomes) or option B (congenital reproductive organs) as the highest priority, then logically, this trans-man should go to the women's restroom (because his DNA and congenital organs are female).

But in reality:
- You wouldn't feel comfortable having a bearded, deep-voiced trans-man go to the women's restroom
- You actually have no way to know a person's DNA or sex assigned at birth
- You can only judge based on visible characteristics (secondary sexual characteristics - option D) or gender expression (option E)

What does this tell us?
This scenario reveals a contradiction: your rational choice says DNA/congenital organs are most important, but your actual behavior relies on appearance and expression to judge. And you have no way to check a person's DNA or congenital organs in reality.`,
      'zh-CN': `想象一下，你走出公共卫生间，看到一个跨性别男性（trans-man）：
- 他留着大胡子
- 声音低沉
- 外貌完全符合传统男性特征
- 但他还没有做下体手术（pre bottom SRS）

根据你刚才的排序选择，如果你把选项A（DNA/染色体）或选项B（先天的生殖器官）放在最高优先级，那么按照逻辑，这个trans-man应该去女卫生间（因为他的DNA和先天器官是女性的）。

但在现实中：
- 你不会感到舒服让一个大胡子、声音低沉的trans-man去女卫生间
- 你实际上根本无法知道一个人的DNA或出生时的性别
- 你只能根据可见的特征（第二性征 - 选项D）或性别表达（选项E）来判断

这说明了什么？
这个场景揭示了一个矛盾：你的理性选择说DNA/先天器官最重要，但你的实际行为却依赖外貌和表达来判断。而且，你在现实中根本没有办法检查一个人的DNA或先天器官。`,
      'zh-TW': `想像一下，你走出公共衛生間，看到一個跨性別男性（trans-man）：
- 他留著大鬍子
- 聲音低沉
- 外貌完全符合傳統男性特徵
- 但他還沒有做下體手術（pre bottom SRS）

根據你剛才的排序選擇，如果你把選項A（DNA/染色體）或選項B（先天的生殖器官）放在最高優先級，那麼按照邏輯，這個trans-man應該去女衛生間（因為他的DNA和先天器官是女性的）。

但在現實中：
- 你不會感到舒服讓一個大鬍子、聲音低沉的trans-man去女衛生間
- 你實際上根本無法知道一個人的DNA或出生時的性別
- 你只能根據可見的特徵（第二性徵 - 選項D）或性別表達（選項E）來判斷

這說明了什麼？
這個場景揭示了一個矛盾：你的理性選擇說DNA/先天器官最重要，但你的實際行為卻依賴外貌和表達來判斷。而且，你在現實中根本沒有辦法檢查一個人的DNA或先天器官。`,
      'fr': `Imaginez que vous quittez des toilettes publiques et voyez un homme transgenre (trans-homme) :
- Il a une barbe complète
- Voix grave
- Apparence complètement masculine
- Mais il n'a pas subi de chirurgie du bas (pre bottom SRS)

Selon votre choix de classement, si vous mettez l'option A (ADN/chromosomes) ou l'option B (organes reproducteurs congénitaux) comme priorité la plus élevée, alors logiquement, ce trans-homme devrait aller aux toilettes des femmes (car son ADN et ses organes congénitaux sont féminins).

Mais en réalité :
- Vous ne seriez pas à l'aise de laisser un trans-homme barbu à la voix grave aller aux toilettes des femmes
- Vous n'avez en fait aucun moyen de connaître l'ADN ou le sexe assigné à la naissance d'une personne
- Vous ne pouvez juger que sur la base de caractéristiques visibles (caractéristiques sexuelles secondaires - option D) ou d'expression de genre (option E)

Qu'est-ce que cela nous dit ?
Ce scénario révèle une contradiction : votre choix rationnel dit que l'ADN/les organes congénitaux sont les plus importants, mais votre comportement réel s'appuie sur l'apparence et l'expression pour juger. Et vous n'avez aucun moyen de vérifier l'ADN ou les organes congénitaux d'une personne dans la réalité.`,
      'es': `Imagina que sales de un baño público y ves a un hombre transgénero (trans-hombre):
- Tiene barba completa
- Voz profunda
- Apariencia completamente masculina
- Pero no ha tenido cirugía inferior (pre bottom SRS)

Según tu elección de clasificación, si pones la opción A (ADN/cromosomas) o la opción B (órganos reproductivos congénitos) como la prioridad más alta, entonces lógicamente, este trans-hombre debería ir al baño de mujeres (porque su ADN y órganos congénitos son femeninos).

Pero en la realidad:
- No te sentirías cómodo teniendo un trans-hombre barbudo de voz profunda yendo al baño de mujeres
- En realidad no tienes forma de saber el ADN o el sexo asignado al nacer de una persona
- Solo puedes juzgar basándote en características visibles (características sexuales secundarias - opción D) o expresión de género (opción E)

¿Qué nos dice esto?
Este escenario revela una contradicción: tu elección racional dice que el ADN/los órganos congénitos son más importantes, pero tu comportamiento real se basa en la apariencia y la expresión para juzgar. Y no tienes forma de verificar el ADN o los órganos congénitos de una persona en la realidad.`,
    },
    condition: (ranking: string[]) => {
      if (!ranking || ranking.length < 2) return false;
      const first = ranking[0];
      const second = ranking[1];
      return first === 'a' || first === 'b' || second === 'a' || second === 'b';
    },
  },
  'restroom-transwoman': {
    id: 'restroom-transwoman',
    title: {
      'en': 'Public Restroom: Trans-woman Scenario',
      'zh-CN': '公共卫生间：跨性别女性场景',
      'zh-TW': '公共衛生間：跨性別女性場景',
      'fr': 'Toilettes publiques : Scénario trans-femme',
      'es': 'Baño público: Escenario trans-mujer',
    },
    content: {
      'en': `Imagine another scenario. You see a transgender woman (trans-woman):
- She shows almost no masculine features
- Her appearance, voice, and demeanor are completely feminine
- She may have had surgery, or she may not have

According to your ranking choice, if you put option A (DNA/chromosomes) or option B (congenital reproductive organs) as the highest priority, then logically, this trans-woman should go to the men's restroom (because her DNA and congenital organs are male).

But in reality:
- You wouldn't feel comfortable having a completely feminine trans-woman go to the men's restroom
- You would actually think she should go to the women's restroom
- Your judgment is based on her appearance and expression, not DNA

What does this tell us?
This scenario further illustrates that even if you think DNA is most important, you cannot know it in reality. You can only judge based on visible characteristics. These visible characteristics (secondary sexual characteristics, gender expression) are the standards you actually use.`,
      'zh-CN': `想象另一个场景，你看到一个跨性别女性（trans-woman）：
- 她几乎看不出任何男性特征
- 外貌、声音、举止都完全符合传统女性特征
- 她可能已经做了手术，也可能没有

根据你刚才的排序选择，如果你把选项A（DNA/染色体）或选项B（先天的生殖器官）放在最高优先级，那么按照逻辑，这个trans-woman应该去男卫生间（因为她的DNA和先天器官是男性的）。

但在现实中：
- 你不会感到舒服让一个完全女性化的trans-woman去男卫生间
- 你实际上会认为她应该去女卫生间
- 你的判断依据是她的外貌和表达，而不是DNA

这说明了什么？
这个场景进一步说明了：即使你认为DNA最重要，但在现实中你无法知道。你只能根据可见的特征来判断。这些可见的特征（第二性征、性别表达）才是你实际使用的标准。`,
      'zh-TW': `想像另一個場景，你看到一個跨性別女性（trans-woman）：
- 她幾乎看不出任何男性特徵
- 外貌、聲音、舉止都完全符合傳統女性特徵
- 她可能已經做了手術，也可能沒有

根據你剛才的排序選擇，如果你把選項A（DNA/染色體）或選項B（先天的生殖器官）放在最高優先級，那麼按照邏輯，這個trans-woman應該去男衛生間（因為她的DNA和先天器官是男性的）。

但在現實中：
- 你不會感到舒服讓一個完全女性化的trans-woman去男衛生間
- 你實際上會認為她應該去女衛生間
- 你的判斷依據是她的外貌和表達，而不是DNA

這說明了什麼？
這個場景進一步說明了：即使你認為DNA最重要，但在現實中你無法知道。你只能根據可見的特徵來判斷。這些可見的特徵（第二性徵、性別表達）才是你實際使用的標準。`,
      'fr': `Imaginez un autre scénario. Vous voyez une femme transgenre (trans-femme) :
- Elle ne montre presque aucune caractéristique masculine
- Son apparence, sa voix et son comportement sont complètement féminins
- Elle a peut-être subi une chirurgie, ou peut-être pas

Selon votre choix de classement, si vous mettez l'option A (ADN/chromosomes) ou l'option B (organes reproducteurs congénitaux) comme priorité la plus élevée, alors logiquement, cette trans-femme devrait aller aux toilettes des hommes (car son ADN et ses organes congénitaux sont masculins).

Mais en réalité :
- Vous ne seriez pas à l'aise de laisser une trans-femme complètement féminine aller aux toilettes des hommes
- Vous penseriez en fait qu'elle devrait aller aux toilettes des femmes
- Votre jugement est basé sur son apparence et son expression, pas sur l'ADN

Qu'est-ce que cela nous dit ?
Ce scénario illustre en outre que même si vous pensez que l'ADN est le plus important, vous ne pouvez pas le savoir dans la réalité. Vous ne pouvez juger que sur la base de caractéristiques visibles. Ces caractéristiques visibles (caractéristiques sexuelles secondaires, expression de genre) sont les standards que vous utilisez réellement.`,
      'es': `Imagina otro escenario. Ves a una mujer transgénero (trans-mujer) :
- Muestra casi ninguna característica masculina
- Su apariencia, voz y comportamiento son completamente femeninos
- Puede haber tenido cirugía, o puede que no

Según tu elección de clasificación, si pones la opción A (ADN/cromosomas) o la opción B (órganos reproductivos congénitos) como la prioridad más alta, entonces lógicamente, esta trans-mujer debería ir al baño de hombres (porque su ADN y órganos congénitos son masculinos).

Pero en la realidad:
- No te sentirías cómodo teniendo una trans-mujer completamente femenina yendo al baño de hombres
- En realidad pensarías que debería ir al baño de mujeres
- Tu juicio se basa en su apariencia y expresión, no en el ADN

¿Qué nos dice esto?
Este escenario ilustra además que incluso si piensas que el ADN es más importante, no puedes saberlo en la realidad. Solo puedes juzgar basándote en características visibles. Estas características visibles (características sexuales secundarias, expresión de género) son los estándares que realmente usas.`,
    },
    condition: (ranking: string[]) => {
      // Show this scenario if a/b are NOT in top 2
      if (!ranking || ranking.length < 2) return true;
      const first = ranking[0];
      const second = ranking[1];
      return first !== 'a' && first !== 'b' && second !== 'a' && second !== 'b';
    },
  },
};

