document.addEventListener('DOMContentLoaded', function () {

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');


    for (let i = 0; i < allButtons.length; i++) {

        allButtons[i].addEventListener('click', function () {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    }

    searchClose?.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
    });

    // Function to handle modal display and form submission
    function setupModal(deleteButton, modalId, formId) {
        var modal = document.getElementById(modalId);
        var closeBtn = modal.querySelector(".close");
        var cancelBtn = modal.querySelector(".cancelDelete");
        var confirmDeleteBtn = modal.querySelector(".confirmDelete");
        var deleteForm = document.getElementById(formId);

        if (deleteButton && modal && deleteForm) {
            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                modal.style.display = "block";
            });

            closeBtn.addEventListener("click", function () {
                modal.style.display = "none";
            });

            cancelBtn.addEventListener("click", function () {
                modal.style.display = "none";
            });

            confirmDeleteBtn.addEventListener("click", function () {
                deleteForm.submit();
            });

            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
        }
    }

    // Handle multiple modals on the dashboard
    var deleteButtons = document.querySelectorAll(".openDeleteModal");
    deleteButtons.forEach(function (button) {
        var postId = button.getAttribute("data-post-id");
        setupModal(button, "deleteModal-" + postId, "deleteForm-" + postId);
    });

    // Handle single post modal
    var singleDeleteBtn = document.getElementById("openDeleteModal");
    if (singleDeleteBtn) {
        setupModal(singleDeleteBtn, "deleteModal", "deleteForm");
    }
});









