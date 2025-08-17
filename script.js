/**
 * Configuration object for interface generation
 */
const CONFIG = {
  shouldUnwrapData: false,
  indentSize: 2
};

/**
 * Cache pour éviter la régénération d'interfaces identiques
 */
const interfaceCache = new Map();

/**
 * Détermine le type TypeScript approprié pour une valeur JavaScript
 * @param {*} value - La valeur à analyser
 * @param {string} interfaceName - Nom de l'interface parente
 * @param {string} key - Clé de la propriété
 * @param {string} indent - Indentation courante
 * @returns {string} Le type TypeScript correspondant
 */
function getTypeScriptType(value, interfaceName, key, indent = '') {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  const jsType = typeof value;
  
  switch (jsType) {
    case 'string':
    case 'number':
    case 'boolean':
      return jsType;
    
    case 'object':
      if (Array.isArray(value)) {
        return getArrayType(value, interfaceName, key, indent);
      }
      
      if (value instanceof Date) {
        return 'Date';
      }
      
      return getObjectType(value, interfaceName, key, indent);
    
    default:
      return 'unknown';
  }
}

/**
 * Détermine le type d'un tableau
 * @param {Array} array - Le tableau à analyser
 * @param {string} interfaceName - Nom de l'interface parente
 * @param {string} key - Clé de la propriété
 * @param {string} indent - Indentation courante
 * @returns {string} Le type TypeScript du tableau
 */
function getArrayType(array, interfaceName, key, indent) {
  if (array.length === 0) return 'unknown[]';
  
  const firstElement = array[0];
  const elementType = getTypeScriptType(firstElement, interfaceName, key, indent);
  
  // Vérifier si tous les éléments ont le même type
  const allSameType = array.every(item => 
    getTypeScriptType(item, interfaceName, key, indent) === elementType
  );
  
  return allSameType ? `${elementType}[]` : 'unknown[]';
}

/**
 * Génère le type d'un objet
 * @param {Object} obj - L'objet à analyser
 * @param {string} interfaceName - Nom de l'interface parente
 * @param {string} key - Clé de la propriété
 * @param {string} indent - Indentation courante
 * @returns {string} Le type TypeScript de l'objet
 */
function getObjectType(obj, interfaceName, key, indent) {
  const cacheKey = JSON.stringify(obj);
  if (interfaceCache.has(cacheKey)) {
    return interfaceCache.get(cacheKey);
  }
  
  const subIndent = indent + ' '.repeat(CONFIG.indentSize);
  let typeStr = '{\n';
  
  Object.entries(obj).forEach(([objKey, objValue]) => {
    const propType = getTypeScriptType(objValue, interfaceName, objKey, subIndent);
    typeStr += `${subIndent}${objKey}: ${propType};\n`;
  });
  
  typeStr += `${indent}}`;
  interfaceCache.set(cacheKey, typeStr);
  
  return typeStr;
}

/**
 * Préprocesse les données JSON selon la configuration
 * @param {*} data - Les données à préprocesser
 * @returns {*} Les données préprocessées
 */
function preprocessData(data) {
  if (!CONFIG.shouldUnwrapData) return data;
  
  let processedData = data;
  
  // Unwrap data property if it exists
  if (processedData && typeof processedData === 'object' && processedData.hasOwnProperty('data')) {
    processedData = processedData.data;
  }
  
  // Get first element if it's an array
  if (Array.isArray(processedData) && processedData.length > 0) {
    processedData = processedData[0];
  }
  
  return processedData;
}

/**
 * Convertit un objet JSON en interface TypeScript
 * @param {Object} jsonObj - L'objet JSON à convertir
 * @param {string} interfaceName - Le nom de l'interface
 * @param {string} indent - L'indentation (usage interne)
 * @returns {string} L'interface TypeScript générée
 */
function jsonToInterface(jsonObj, interfaceName, indent = '') {
  if (!jsonObj || typeof jsonObj !== 'object') {
    throw new Error('L\'objet JSON fourni n\'est pas valide');
  }
  
  if (!interfaceName || typeof interfaceName !== 'string') {
    throw new Error('Le nom de l\'interface doit être une chaîne non vide');
  }
  
  // Préprocesser les données
  const processedData = preprocessData(jsonObj);
  
  // Vider le cache pour chaque nouvelle génération d'interface
  interfaceCache.clear();
  
  let interfaceStr = `interface ${interfaceName} {\n`;
  
  Object.entries(processedData).forEach(([key, value]) => {
    const type = getTypeScriptType(value, interfaceName, key, indent + ' '.repeat(CONFIG.indentSize));
    interfaceStr += `${indent}  ${key}: ${type};\n`;
  });
  
  interfaceStr += `${indent}}`;
  return interfaceStr;
}

/**
 * Formate un objet JSON de manière lisible
 * @param {*} json - L'objet à formater
 * @returns {string} Le JSON formaté
 */
function formatJSON(json) {
  try {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    return JSON.stringify(json, null, 2);
  } catch (error) {
    console.error('Erreur lors du formatage JSON:', error);
    return 'Erreur: JSON invalide';
  }
}

/**
 * Affiche un message toast à l'utilisateur
 * @param {string} text - Le texte à afficher
 * @param {string} type - Le type de toast ('success', 'error', 'info')
 */
function toast(text, type = 'info') {
  const toastElement = document.querySelector('.toast');
  if (!toastElement) {
    console.warn('Élément toast non trouvé');
    return;
  }
  
  toastElement.textContent = text;
  toastElement.classList.add('show');
  
  // Définir la couleur selon le type
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8'
  };
  
  toastElement.style.backgroundColor = colors[type] || colors.info;

  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3000);
}


/**
 * Configure la copie dans le presse-papiers pour un élément
 * @param {string} elementSelector - Sélecteur de l'élément
 * @param {string} text - Texte à copier
 */
function copyToClipboard(elementSelector, text) {
  const element = document.querySelector(elementSelector);
  if (!element) {
    console.warn(`Élément ${elementSelector} non trouvé`);
    return;
  }
  
  // Supprimer les anciens listeners pour éviter les doublons
  const newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  
  newElement.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copié !', 'success');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast('Erreur lors de la copie', 'error');
    }
  });
}

/**
 * Initialise les interactions SaaS
 */
function initializeSaaSFeatures() {
  // Smooth scroll pour les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Animation de parallaxe simple pour les cartes de fonctionnalités
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observer les cartes de fonctionnalités
  document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
  });
  
  // Bouton CTA du header
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const targetForm = document.querySelector('#myForm');
      if (targetForm) {
        targetForm.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }
}

/**
 * Initialise l'application
 */
function initializeApp() {
  const form = document.querySelector("#myForm");
  const switchInput = document.querySelector('.switch input[type="checkbox"]');
  
  if (!form) {
    console.error('Formulaire non trouvé');
    return;
  }
  
  // Initialiser les fonctionnalités SaaS
  initializeSaaSFeatures();

  // Configuration du switch pour unwrap data
  if (switchInput) {
    switchInput.addEventListener('change', function () {
      CONFIG.shouldUnwrapData = this.checked;
    });
  }

  // Gestionnaire de soumission du formulaire
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const urlInput = document.querySelector("#url");
    const interfaceNameInput = document.querySelector('#nameInterface');
    const buttonText = document.querySelector('.button-text');
    const buttonLoader = document.querySelector('.button-loader');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    if (!urlInput || !interfaceNameInput) {
      toast('Éléments du formulaire manquants', 'error');
      return;
    }
    
    const urlValue = urlInput.value.trim();
    const interfaceName = interfaceNameInput.value.trim() || 'GeneratedInterface';
    
    if (!urlValue) {
      toast('Veuillez entrer une URL', 'error');
      return;
    }
    
    // Activer l'état de chargement
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('loading');
    }
    if (buttonText) buttonText.style.display = 'none';
    if (buttonLoader) buttonLoader.style.display = 'inline';
    
    try {
      // Validation basique de l'URL
      new URL(urlValue);
      
      const response = await fetch(urlValue);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Afficher le JSON formaté avec animation
      const fetchElement = document.querySelector("#fetch");
      if (fetchElement) {
        fetchElement.textContent = formatJSON(data);
        hljs.highlightBlock(fetchElement);
        fetchElement.parentElement.classList.add('animate-in');
      }
      
      // Générer l'interface TypeScript avec animation
      const interfaceStr = jsonToInterface(data, interfaceName);
      const resultElement = document.querySelector("#result");
      
      if (resultElement) {
        resultElement.textContent = interfaceStr;
        hljs.highlightBlock(resultElement);
        resultElement.parentElement.classList.add('animate-in');
      }
      
      // Configurer la copie
      copyToClipboard('.btn-copy', interfaceStr);
      
      toast('Interface générée avec succès !', 'success');
      
    } catch (error) {
      console.error('Erreur:', error);
      
      if (error instanceof TypeError && error.message.includes('URL')) {
        toast('URL invalide', 'error');
      } else if (error.message.includes('JSON')) {
        toast('Réponse JSON invalide', 'error');
      } else {
        toast('Erreur lors de la récupération des données', 'error');
      }
    } finally {
      // Désactiver l'état de chargement
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
      if (buttonText) buttonText.style.display = 'inline';
      if (buttonLoader) buttonLoader.style.display = 'none';
    }
  });
}

// Initialiser l'application quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Appliquer highlight.js au contenu initial
document.addEventListener('DOMContentLoaded', function() {
  hljs.highlightAll();
});



