export interface Poilu {
  id: string;
  nom: string;
  naissance: number;
  deces: string;
  lieu: string;
  departement_deces: string;
  regiment: string;
  metier: string;
  tags: string[];
  photo?: string;
  resume: string;
  sections: [string, string][];
  glossaire?: [string, string][];
}

export const poilus: Poilu[] = [
  {
    id: "camille-bernard",
    nom: "Camille Bernard",
    naissance: 1892,
    deces: "1914-09-10",
    lieu: "Saint-Mard-sur-le-Mont",
    departement_deces: "Marne",
    regiment: "42e RI",
    metier: "Cultivateur",
    tags: ["Marne", "Infanterie", "Mobilisé"],
    resume: "Fils d'agriculteurs champenois, mort à vingt-deux ans lors de la première bataille de la Marne.",
    sections: [
      ["Une jeunesse à la ferme", "Camille travaille les terres de sa famille près d'Épernay. Il se fiancé en 1913 avec Louise, la fille du voisin."],
      ["La mobilisation", "Appelé dès le 2 août 1914, il rejoint le 42e régiment d'infanterie et participe à la retraite de Belgique."],
      ["La Marne", "Tué le 10 septembre 1914 dans les bois de Saint-Mard, alors que son bataillon tente de contenir l'avancée allemande."]
    ],
    glossaire: [
      ["RI", "Régiment d'infanterie."],
      ["Bataille de la Marne", "Victoire alliée de septembre 1914 qui arrête l'offensive allemande sur Paris."]
    ]
  },
  {
    id: "jules-fournier",
    nom: "Jules Fournier",
    naissance: 1887,
    deces: "1915-09-25",
    lieu: "Givenchy-en-Gohelle",
    departement_deces: "Pas-de-Calais",
    regiment: "58e RI",
    metier: "Mineur",
    tags: ["Artois", "Infanterie", "Syndiqué"],
    resume: "Mineur du bassin houiller lensois, mort à vingt-huit ans lors de l'offensive d'Artois.",
    sections: [
      ["Sous terre avant le front", "Jules descend dans la fosse de Liévin dès l'âge de quatorze ans. Syndiqué, il milite pour de meilleures conditions."],
      ["L'Artois", "En septembre 1915, son unité participe à l'assaut vers la côte 70, au nord de Lens."],
      ["Disparu", "Son corps n'a jamais été retrouvé. Son nom est inscrit sur le monument aux morts de Liévin."]
    ],
    glossaire: [
      ["Offensive d'Artois", "Grande offensive franco-britannique de mai-juin 1915, relancée en automne."]
    ]
  },
  {
    id: "augustin-morel",
    nom: "Augustin Morel",
    naissance: 1895,
    deces: "1916-07-12",
    lieu: "Longueval",
    departement_deces: "Somme",
    regiment: "23e RI",
    metier: "Boulanger",
    tags: ["Somme", "Infanterie", "Parisien"],
    resume: "Boulanger du Faubourg Saint-Antoine, tué à vingt-et-un ans dans la bataille de la Somme.",
    sections: [
      ["Le fournil parisien", "Augustin lève la pâte chaque nuit dans la boulangerie familiale. Ses clients apprécient son caractère jovial."],
      ["Juillet 1916", "Son régiment est engagé dans les bois de Trônes, près de Longueval, où les combats sont particulièrement meurtriers."],
      ["Deuil", "Sa mère gardera jusqu'à sa mort le livret militaire et une mèche de cheveux d'Augustin."]
    ],
    glossaire: [
      ["Bataille de la Somme", "Offensive majeure de juillet à novembre 1916 sur le front occidental."]
    ]
  },
  {
    id: "emile-garnier",
    nom: "Émile Garnier",
    naissance: 1889,
    deces: "1917-04-16",
    lieu: "Braye-en-Laonnois",
    departement_deces: "Aisne",
    regiment: "151e RI",
    metier: "Instituteur",
    tags: ["Chemin des Dames", "Infanterie", "Instruction"],
    resume: "Instituteur laïque de la Creuse, mort à vingt-huit ans au début de l'offensive Nivelle.",
    sections: [
      ["La classe", "Émile enseigne dans un village de la Creuse. Il partage son temps entre l'école, la bibliothèque et les réunions de la Ligue des droits de l'homme."],
      ["Le Chemin des Dames", "Le 16 avril 1917, son régiment monte à l'assaut sous un barrage allemand nourri."],
      ["Mémoire", "Ses élèves plantent un marronnier dans la cour de l'école en son honneur."]
    ],
    glossaire: [
      ["Offensive Nivelle", "Offensive française d'avril 1917 sur le Chemin des Dames, vivement contestée par les soldats."]
    ]
  },
  {
    id: "marcel-lefranc",
    nom: "Marcel Lefranc",
    naissance: 1894,
    deces: "1918-05-27",
    lieu: "Pontavert",
    departement_deces: "Aisne",
    regiment: "6e BCP",
    metier: "Comptable",
    tags: ["Aisne", "Chasseurs", "Volontaire"],
    resume: "Comptable lillois engagé volontaire, tué à vingt-quatre ans quelques mois avant l'armistice.",
    sections: [
      ["Le bureau", "Marcel tient les comptes d'une filature de Roubaix. Il rêve de devenir avoué après la guerre."],
      ["Chasseur", "Engagé en 1914, il sert dans un bataillon de chasseurs à pied et est blessé une première fois en 1916."],
      ["Mai 1918", "Il tombe lors de l'offensive allemande sur l'Aisne, alors que son unité tente de protéger le passage de la Vesle."]
    ],
    glossaire: [
      ["BCP", "Bataillon de chasseurs à pied."]
    ]
  },
  {
    id: "antoine-duval",
    nom: "Antoine Duval",
    naissance: 1890,
    deces: "1918-10-23",
    lieu: "Romagne-sous-Montfaucon",
    departement_deces: "Meuse",
    regiment: "128e RI",
    metier: "Charpentier",
    tags: ["Meuse", "Infanterie", "Normand"],
    resume: "Charpentier normand, mort à vingt-huit ans dans les dernières semaines de la guerre, à l'ouest de Verdun.",
    sections: [
      ["Les charpentes", "Antoine travaille avec son père dans l'Eure. Il aime dessiner les plans des églises du pays d'Ouche."],
      ["La Meuse", "Mobilisé en 1914, il passe quatre ans dans les secteurs de Verdun et de l'Argonne."],
      ["Octobre 1918", "Tué par un éclat d'obus alors que son régiment avance vers la ligne Hindenburg, à quelques jours de la fin des combats."]
    ],
    glossaire: [
      ["Argonne", "Forêt et plateau de l'est de la France, théâtre de combats acharnés de 1914 à 1918."]
    ]
  }
];

export function getPoiluById(id: string): Poilu | undefined {
  return poilus.find(p => p.id === id);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  poilus.forEach(p => {
    p.tags.forEach(tag => {
      if (tag !== p.metier) tags.add(tag);
    });
  });
  return Array.from(tags).sort();
}

export function searchPoilus(query: string, tag?: string): Poilu[] {
  const q = query.toLowerCase();
  return poilus.filter(p => {
    const hay = `${p.nom} ${p.regiment} ${p.lieu} ${p.metier} ${p.departement_deces}`.toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    const matchesTag = !tag || p.tags.includes(tag);
    return matchesQuery && matchesTag;
  }).sort((a, b) => a.nom.localeCompare(b.nom));
}
