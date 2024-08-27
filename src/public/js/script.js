document.addEventListener('DOMContentLoaded', function () {


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









