// Run when the document is loaded and ready
$(document).ready(() => {
  $('#button-create').click(newItemModal);
  $('#button-upload').click(uploadList);
  $('#button-download').click(downloadList);
  $('#button-delete').click(deleteList);

  // Initial progress update
  updateProgression();

  // Attach event handlers to existing buttons
  $('.complete-button').click(function() {
    markTaskComplete($(this).closest('.todo'));
  });

  $('.remove-button').click(function() {
    deleteTask($(this).closest('.todo'));
  });
});

function markTaskComplete($taskElement) {
  $taskElement.removeClass('incomplete').addClass('complete');
  updateProgression();
}

function deleteTask($taskElement) {
  $taskElement.remove();
  updateProgression();
}


function newItemModal() {
  $("#createModal").modal("show");

  // Ensure the click event handler is only attached once (prevents double alerts)
  $("#saveTaskButton").off('click').click( () => {
    let taskTitle = $("#taskTitle").val();
    let taskDescription = $("#taskDescription").val();

    if (taskTitle && taskDescription) {
      // Create new task
      let $todoList = $('#todo-list');
      let newTask = `
        <div class="todo incomplete">
          <div class="todo-header">
            <h3>${taskTitle}</h3>
            <div class="todo-buttons">
              <button class="complete-button"><img class='svg' src="/simple-html/img/complete.svg" alt="Complete"></button>
              <button class="remove-button"><img class='svg' src="/simple-html/img/remove.svg" alt="Delete"></button>
            </div>
          </div>
          <hr>
          <p>${taskDescription}</p>
        </div>
      `;

      $todoList.append(newTask)

      // Attach event handlers to new buttons
      $('.complete-button').last().click(function() {
        markTaskComplete($(this).closest('.todo'));
      });

      $('.remove-button').last().click(function() {
        deleteTask($(this).closest('.todo'));
      });


      // Clear and hide the form
      $("#createTaskForm")[0].reset();
      $("#createModal").modal("hide");
      console.log("Added new task.")
      updateProgression();
    } else {
      alert("Please fill out all fields.");
    }
  });
}


function uploadList() {
  const jsonText = $('#uploadTextarea').val();
  try {
    const tasks = JSON.parse(jsonText);
    $('#todo-list').empty();
    tasks.forEach(task => {
      let newTask = `
        <div class="todo ${task.status}">
          <div class="todo-header">
            <h3>${task.title}</h3>
            <div class="todo-buttons">
              <button class="complete-button"><img class='svg' src="/simple-html/img/complete.svg" alt="Complete"></button>
              <button class="remove-button"><img class='svg' src="/simple-html/img/remove.svg" alt="Delete"></button>
            </div>
          </div>
          <hr>
          <p>${task.description}</p>
        </div>
      `;
      $('#todo-list').append(newTask);
    });

    // Attach event handlers to new buttons
    $('.complete-button').click(function() {
      markTaskComplete($(this).closest('.todo'));
    });

    $('.remove-button').click(function() {
      deleteTask($(this).closest('.todo'));
    });

    updateProgression();
    $("#uploadModal").modal("hide");
  } catch (e) {
    alert("Invalid JSON. Please check your input.");
  }
}


function downloadList() {
  const tasks = [];
  $('#todo-list .todo').each(function() {
    const taskTitle = $(this).find('h3').text();
    const taskDescription = $(this).find('p').text();
    const taskStatus = $(this).hasClass('complete') ? 'complete' : 'incomplete';
    tasks.push({ title: taskTitle, description: taskDescription, status: taskStatus });
  });

  const jsonText = JSON.stringify(tasks, null, 2);
  const $downloadTextarea = $('<textarea>').text(jsonText).css({ width: '100%', height: '300px' });
  const $modalContent = `
    <div class="modal fade" id="downloadModal" tabindex="-1" aria-labelledby="downloadModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="downloadModalLabel">Download Tasks JSON</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" rows="10" readonly>${jsonText}</textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  $('body').append($modalContent);
  $('#downloadModal').modal('show');
  $('#downloadModal').on('hidden.bs.modal', function() {
    $(this).remove();
  });
}


function deleteList() {
  $('#todo-list').empty();
  console.log("Deleted all tasks")

  updateProgression();
}


function updateProgression() {
  let totalTasks = $('#todo-list .todo').length;
  let completedTasks = $('#todo-list .complete').length;
  let percentage = (totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100));
  setProgress(percentage);

  console.log(`Set progress to ${percentage}.`)
}

function setProgress(percentage) {
  let $bar = $('#progress-bar');

  $bar.text(`${percentage}%`);
  $bar.attr('style', `width: ${percentage}%`);
  $bar.attr('aria-valuenow', `${percentage}`);
}