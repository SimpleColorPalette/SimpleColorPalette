/**
 * @param {string | ArrayBuffer | null} blob 
 * @param {HTMLImageElement} imgElement 
 */
const LoadImage = (blob, imgElement) => {    
    const reader = new FileReader();
    reader.onload = function (event) {
        imgElement.src = event.target.result;
    };
    reader.readAsDataURL(blob);
}

/**
 * @param {HTMLInputElement} imageInput 
 * @param {HTMLImageElement} imgElement 
 */
const PasteImageListener = (imageInput, imgElement) => {
    imageInput.addEventListener('paste',
        (event) => {
            const clipboardItems = event.clipboardData.items;
            for (let i = 0; i < clipboardItems.length; i++) {
                if (clipboardItems[i].type.indexOf('image') !== -1) {
                    const blob = clipboardItems[i].getAsFile();
                    LoadImage(blob, imgElement);
                    break;
                }
            }
        }
    );
}

/**
 * @param {HTMLInputElement} imageButton 
 * @param {HTMLImageElement} imgElement 
 */
const UploadImage = (imageButton, imgElement) => {
    imageButton.addEventListener('change',
        (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                LoadImage(file, imgElement);
            } else {
                alert("Please upload a valid image file.");
            }
        }
    );
}

/**
 * @param {HTMLElement} dropZone 
 * @param {HTMLImageElement} imgElement 
 */
const DragAndDropImage = (dropZone, imgElement) => {
    // Prevent default drag behaviors
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight the drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('hover');
        }, false);
    });

    // Remove highlight when the drag leaves the drop zone
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('hover');
        }, false);
    });

    // Handle dropped files
    const handleDrop = (e) => {
        const files = e.dataTransfer.files;
        if (files.length && files[0].type.startsWith('image/')) {
            const file = files[0];
            LoadImage(file, imgElement);
        } else {
            alert("Please drop a valid image file.");
        }
    }
    dropZone.addEventListener('drop', handleDrop, false);
}
// export {PasteImageListener, UploadImage};