$(document).ready(function() {

  // --- FONCTION DE SAUVEGARDE (JSON) ---
  const saveToLocalStorage = () => {
    const tasks = [];
    $('ol li').each(function() {
      tasks.push({
        // On récupère le texte bien spécifique dans le span .task
        text: $(this).find('.task').text().trim(),
        completed: $(this).hasClass('completed')
      });
    });
    localStorage.setItem('myTodoListData', JSON.stringify(tasks));
  };

  // --- FONCTION DE CHARGEMENT ---
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('myTodoListData');
    if (savedData) {
      const tasks = JSON.parse(savedData);
      tasks.forEach(task => {
        const checkedIcon = task.completed ? 'fa-check-square green' : 'fa-square';
        const liClass = task.completed ? 'completed' : '';
        
        $('ol').append(`
          <li class="${liClass}">
            <span class="task">${task.text}</span>
            <span class="trash" title="Supprimer"><i class="fas fa-trash fa-lg"></i></span>
            <span class="edit" title="Modifier"><i class="fas fa-pencil-alt fa-lg"></i></span>
            <span class="checked" title="Terminer"><i class="far ${checkedIcon} fa-lg"></i></span>
          </li>`);
      });
    }
  };

  loadFromLocalStorage();

  // --- FONCTION AJOUTER ---
  const addTask = () => {
    const inputField = $('input#input'); // On cible l'ID précis
    let todoText = inputField.val().trim();
    
    if (todoText.length !== 0) {
      // Formatage (Majuscule au début)
      todoText = todoText.charAt(0).toUpperCase() + todoText.slice(1);

      const newTaskHtml = `
        <li>
          <span class="task">${todoText}</span>
          <span class="trash"><i class="fas fa-trash fa-lg"></i></span>
          <span class="edit"><i class="fas fa-pencil-alt fa-lg"></i></span>
          <span class="checked"><i class="far fa-square fa-lg"></i></span>
        </li>`;

      $('ol').append(newTaskHtml);
      inputField.val(''); // Vide l'input
      $('#fa-plus').hide(); // Cache l'icône +
      saveToLocalStorage();
    }
  };

  // --- ÉVÉNEMENTS ---

  // Correction : On cible bien l'ID de l'input pour la touche Entrée
  $(document).on('keydown', 'input#input', function(e) {
    if (e.keyCode === 13) {
      addTask();
    }
  });

  // Clic sur le bouton plus (ID plus)
  $(document).on('click', '#plus', function() {
    addTask();
  });

  // Compléter une tâche
  $('ol').on('click', '.checked', function(e) {
    e.stopPropagation();
    $(this).find('i').toggleClass('fa-square fa-check-square green');
    $(this).parent('li').toggleClass('completed');
    saveToLocalStorage();
  });

  // Supprimer une tâche
  $('ol').on('click', '.trash', function(e) {
    e.stopPropagation();
    const $li = $(this).parent('li');
    $li.fadeOut(300, function() {
      $(this).remove();
      saveToLocalStorage();
    });
  });

  // Éditer une tâche
  $('ol').on('click', '.edit', function(e) {
    e.stopPropagation();
    const $li = $(this).parent('li');
    const $taskSpan = $li.find('.task');

    if (!$li.hasClass('completed')) {
      $taskSpan.prop('contenteditable', true).focus();
      $(this).addClass('orange');

      // Fin d'édition
      $taskSpan.on('blur keydown', function(event) {
        if (event.type === 'blur' || event.keyCode === 13) {
          if (event.keyCode === 13) event.preventDefault();
          $taskSpan.prop('contenteditable', false);
          $li.find('.edit').removeClass('orange');
          saveToLocalStorage();
        }
      });
    }
  });

  // --- VISUEL DU BOUTON PLUS ---
  $('#fa-plus').hide();
  $('input#input').on('input', function() {
    if ($(this).val().trim().length > 0) {
      $('#fa-plus').show();
    } else {
      $('#fa-plus').hide();
    }
  });
});