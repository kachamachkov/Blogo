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

    function setupModal(deleteButton, modalId, formId) {
        const modal = document.getElementById(modalId);
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancelDelete');
        const confirmDeleteBtn = modal.querySelector('.confirmDelete');
        const deleteForm = document.getElementById(formId);

        if (deleteButton && modal && deleteForm) {
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                modal.style.display = 'block';
            });

            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
            });

            cancelBtn.addEventListener('click', function () {
                modal.style.display = 'none';
            });

            confirmDeleteBtn.addEventListener('click', function () {
                deleteForm.submit();
            });

            window.addEventListener('click', function (event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    const deleteButtons = document.querySelectorAll('.openDeleteModal');
    deleteButtons.forEach(function (button) {
        const postId = button.getAttribute('data-post-id');
        setupModal(button, 'deleteModal-' + postId, 'deleteForm-' + postId);
    });

    const singleDeleteBtn = document.getElementById('openDeleteModal');
    if (singleDeleteBtn) {
        setupModal(singleDeleteBtn, 'deleteModal', 'deleteForm');
    }
});









