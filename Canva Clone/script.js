document.addEventListener("DOMContentLoaded", function () {
	const canvas = document.getElementById("canvas");
	const tools = document.querySelectorAll(".tool");
	const elemControls = document.querySelector(".element-controls");
	const deleteBtn = document.getElementById("delete-btn");
	const duplicateBtn = document.getElementById("duplicate-btn");
	const bringFrontBtn = document.getElementById("bring-front-btn");
	const sendBackBtn = document.getElementById("send-back-btn");
	const shapesMenu = document.querySelector(".shapes-menu");
	const shapeOptions = document.querySelectorAll(".shape-option");
	const colorPickers = document.querySelectorAll(".color-picker .color");
	const textStyleBtns = document.querySelectorAll(".text-style-btn");
	const alignmentBtns = document.querySelectorAll(".alignment-btn");
	const fontFamilySelect = document.getElementById("font-family");
	const elementWidthInput = document.getElementById("element-width");
	const elementHeightInput = document.getElementById("element-height");
	const elementXInput = document.getElementById("element-x");
	const elementYInput = document.getElementById("element-y");
	const canvasContainer = document.querySelector(".canvas-container");
	const propertyGroups = document.querySelectorAll(".property-group");
	const loadingOverlay = document.getElementById("loading-overlay");
	const notificationToast = document.getElementById("notification-toast");
	const notificationMessage = document.getElementById("notification-message");
	const emptyState = document.querySelector(".empty-state");

	let selectedElement = null;
	let isDragging = false;
	let currentZIndex = 10;
	let dragStartX = 0;
	let dragStartY = 0;
	let elementStartLeft = 0;
	let elementStartTop = 0;
	let canvasScale = 1;
	let isTextEditing = false;

	init();

	function init() {
		showLoading(true);

		setTimeout(() => {
			const existingElements = canvas.querySelectorAll(".canvas-element");
			if (existingElements.length > 0) {
				existingElements.forEach((el) => {
					const zIndex = parseInt(el.style.zIndex) || 1;
					if (zIndex >= currentZIndex) {
						currentZIndex = zIndex + 1;
					}
					addElementEventListeners(el);
				});
			}
			updatePropertiesPanelVisibility(false);

			initEventListeners();
			showLoading(false);

			showNotification(
				"Welcome to Canva Clone! Click on any element to edit.",
				"info"
			);
		}, 800);
	}

	function showLoading(show) {
		if (show) {
			loadingOverlay.classList.remove("hidden");
		} else {
			loadingOverlay.classList.add("hidden");
		}
	}

	function showNotification(message, type = "info") {
		notificationToast.className = "";
		notificationToast.classList.add(type);

		const iconElement = notificationToast.querySelector("i");
		if (iconElement) {
			iconElement.className = "";
			switch (type) {
				case "success":
					iconElement.className = "fas fa-check-circle";
					break;
				case "error":
					iconElement.className = "fas fa-exclamation-circle";
					break;
				default:
					iconElement.className = "fas fa-info-circle";
			}
		}
		notificationMessage.textContent = message;

		notificationToast.classList.remove("hidden");

		setTimeout(() => {
			notificationToast.classList.add("hidden");
		}, 3000);
	}

	function initEventListeners() {
		tools.forEach((tool) => {
			tool.addEventListener("click", handleToolClick);
		});

		canvas.addEventListener("click", handleCanvasClick);

		canvasContainer.addEventListener("click", function (e) {
			if (e.target === canvasContainer) {
				deselectAllElements();
				shapesMenu.classList.add("hidden");
			}
		});

		deleteBtn.addEventListener("click", deleteSelectedElement);
		duplicateBtn.addEventListener("click", duplicateSelectedElement);
		bringFrontBtn.addEventListener("click", bringToFront);
		sendBackBtn.addEventListener("click", sendToBack);

		shapeOptions.forEach((option) => {
			option.addEventListener("click", addShape);
		});

		elementWidthInput.addEventListener("input", updateElementDimensions);
		elementHeightInput.addEventListener("input", updateElementDimensions);
		elementXInput.addEventListener("input", updateElementPosition);
		elementYInput.addEventListener("input", updateElementPosition);
		fontFamilySelect.addEventListener("change", updateTextFont);

		textStyleBtns.forEach((btn) => {
			btn.addEventListener("click", applyTextStyle);
		});

		alignmentBtns.forEach((btn) => {
			btn.addEventListener("click", applyTextAlignment);
		});

		colorPickers.forEach((color) => {
			color.addEventListener("click", applyColor);
		});

		document.addEventListener("mousemove", handleDragMove);
		document.addEventListener("mouseup", handleDragEnd);

		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);

		document.addEventListener("click", function (e) {
			if (
				!e.target.closest(".shapes-menu") &&
				!e.target.closest("[data-tool='shapes']")
			) {
				shapesMenu.classList.add("hidden");
			}
		});

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				deselectAllElements();
				shapesMenu.classList.add("hidden");
			} else if (e.key === "Delete" && selectedElement) {
				deleteSelectedElement();
			} else if (e.ctrlKey || e.metaKey) {
				if (e.key === "d" && selectedElement) {
					e.preventDefault();
					duplicateSelectedElement();
					showNotification("Element duplicated", "success");
				} else if (e.key === "c" && selectedElement) {
				}
			}
		});

		window.addEventListener("resize", function () {
			if (window.innerWidth <= 768) {
				elemControls.classList.remove("hidden");
			} else if (!selectedElement) {
				elemControls.classList.add("hidden");
			}
		});

		const mobileControlsToggle = document.getElementById(
			"mobile-controls-toggle"
		);
		if (mobileControlsToggle) {
			mobileControlsToggle.addEventListener("click", function () {
				elemControls.classList.toggle("hidden");
			});
		}

		const sidebarToggle = document.getElementById("sidebar-toggle");
		if (sidebarToggle) {
			sidebarToggle.addEventListener("click", function () {
				const sidebar = document.querySelector(".sidebar");
				sidebar.classList.toggle("collapsed");
			});
		}

		const propertiesToggle = document.getElementById("properties-toggle");
		if (propertiesToggle) {
			propertiesToggle.addEventListener("click", function () {
				const propertiesPanel = document.querySelector(".properties-panel");
				propertiesPanel.classList.toggle("collapsed");
			});
		}

		if (window.innerWidth <= 768) {
			const propertiesPanel = document.querySelector(".properties-panel");
			if (propertiesPanel) {
				propertiesPanel.classList.add("collapsed");
			}
		}
	}

	function handleToolClick(e) {
		const tool = e.currentTarget.getAttribute("data-tool");

		switch (tool) {
			case "text":
				addTextElement();
				showNotification("Text added. Click to edit.", "info");
				break;
			case "shapes":
				toggleShapesMenu(e);
				break;
			case "upload":
				triggerFileUpload();
				break;
		}
	}

	function handleCanvasClick(e) {
		if (e.target === canvas) {
			deselectAllElements();
			shapesMenu.classList.add("hidden");
		}
	}

	function addTextElement() {
		const textElement = document.createElement("div");
		textElement.className = "canvas-element text-element";

		const canvasRect = canvas.getBoundingClientRect();
		const centerX = canvasRect.width / 2 - 100;
		const centerY = canvasRect.height / 2 - 50;

		textElement.style.left = `${centerX}px`;
		textElement.style.top = `${centerY}px`;
		textElement.style.zIndex = currentZIndex++;

		const textContent = document.createElement("p");
		textContent.contentEditable = true;
		textContent.innerText = "Add your text here";
		textContent.style.minWidth = "150px";

		textElement.appendChild(textContent);
		canvas.appendChild(textElement);

		addElementEventListeners(textElement);

		selectElement(textElement);

		setTimeout(() => {
			textContent.focus();
			document.execCommand("selectAll", false, null);
			isTextEditing = true;
		}, 10);
	}

	function toggleShapesMenu(e) {
		if (shapesMenu.classList.contains("hidden")) {
			const rect = e.currentTarget.getBoundingClientRect();
			const windowWidth = window.innerWidth;

			if (rect.right + 200 > windowWidth) {
				shapesMenu.style.left = `${rect.left - 200}px`;
			} else {
				shapesMenu.style.left = `${rect.right + 10}px`;
			}

			shapesMenu.style.top = `${rect.top}px`;
			shapesMenu.classList.remove("hidden");
		} else {
			shapesMenu.classList.add("hidden");
		}
	}

	function addShape(e) {
		const shapeType = e.currentTarget.getAttribute("data-shape");

		const shapeElement = document.createElement("div");
		shapeElement.className = `canvas-element shape-element ${shapeType}`;

		const canvasRect = canvas.getBoundingClientRect();
		const centerX = canvasRect.width / 2 - 50;
		const centerY = canvasRect.height / 2 - 50;

		shapeElement.style.left = `${centerX}px`;
		shapeElement.style.top = `${centerY}px`;
		shapeElement.style.width = "100px";
		shapeElement.style.height = "100px";
		shapeElement.style.zIndex = currentZIndex++;

		switch (shapeType) {
			case "circle":
				shapeElement.style.borderRadius = "50%";
				shapeElement.style.backgroundColor = "#40c057";
				break;
			case "triangle":
				shapeElement.style.backgroundColor = "transparent";
				shapeElement.style.width = "0";
				shapeElement.style.height = "0";
				shapeElement.style.borderLeft = "50px solid transparent";
				shapeElement.style.borderRight = "50px solid transparent";
				shapeElement.style.borderBottom = "100px solid #fab005";
				break;
			default:
				shapeElement.style.backgroundColor = "#4dabf7";
		}

		canvas.appendChild(shapeElement);

		addElementEventListeners(shapeElement);

		selectElement(shapeElement);

		showNotification(
			`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added`,
			"success"
		);

		shapesMenu.classList.add("hidden");
	}

	function triggerFileUpload() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		input.onchange = (e) => {
			const file = e.target.files[0];
			if (file) {
				if (file.type.match("image.*")) {
					showLoading(true);
					const reader = new FileReader();
					reader.onload = function (event) {
						addImageElement(event.target.result);
						showLoading(false);
						showNotification("Image uploaded successfully", "success");
					};
					reader.onerror = function () {
						showLoading(false);
						showNotification("Failed to read image file", "error");
					};
					reader.readAsDataURL(file);
				} else {
					showNotification("Please select an image file", "error");
				}
			}
		};

		input.click();
	}

	function addImageElement(src) {
		const imageElement = document.createElement("div");
		imageElement.className = "canvas-element image-element";

		const canvasRect = canvas.getBoundingClientRect();
		const centerX = canvasRect.width / 2 - 100;
		const centerY = canvasRect.height / 2 - 100;

		imageElement.style.left = `${centerX}px`;
		imageElement.style.top = `${centerY}px`;
		imageElement.style.width = "200px";
		imageElement.style.height = "auto";
		imageElement.style.zIndex = currentZIndex++;

		const img = document.createElement("img");
		img.src = src;
		img.style.width = "100%";
		img.style.height = "100%";
		img.style.objectFit = "contain";

		img.onerror = function () {
			imageElement.remove();
			showNotification(
				"Failed to load image. Please try another one.",
				"error"
			);
		};

		imageElement.appendChild(img);
		canvas.appendChild(imageElement);

		addElementEventListeners(imageElement);

		selectElement(imageElement);
	}

	function addElementEventListeners(element) {
		element.addEventListener("click", function (e) {
			e.stopPropagation();

			if (e.target.contentEditable === "true" && isTextEditing) {
				return;
			}

			selectElement(element);
		});

		if (element.classList.contains("text-element")) {
			const textContent = element.querySelector("p");

			textContent.addEventListener("focus", function () {
				isTextEditing = true;
				if (textContent.innerText === "Add your text here") {
					document.execCommand("selectAll", false, null);
				}
			});

			textContent.addEventListener("blur", function () {
				isTextEditing = false;
				if (textContent.innerText.trim() === "") {
					textContent.innerText = "Add your text here";
				}
			});

			textContent.addEventListener("input", function () {
				if (element === selectedElement) {
					updatePropertiesPanelValues();
				}
			});
		}

		element.addEventListener("mousedown", function (e) {
			if (e.target.contentEditable === "true") return;

			e.preventDefault();
			initDrag(e, element);
		});

		element.addEventListener(
			"touchstart",
			function (e) {
				if (e.target.contentEditable === "true") return;

				e.preventDefault();
				const touch = e.touches[0];
				const touchEvent = {
					clientX: touch.clientX,
					clientY: touch.clientY,
				};
				initDrag(touchEvent, element);
			},
			{ passive: false }
		);
	}

	function initDrag(e, element) {
		isDragging = true;
		selectedElement = element;
		selectElement(element);

		dragStartX = e.clientX;
		dragStartY = e.clientY;
		elementStartLeft = parseInt(element.style.left) || 0;
		elementStartTop = parseInt(element.style.top) || 0;

		element.classList.add("dragging");
	}

	function handleDragMove(e) {
		if (!isDragging || !selectedElement) return;

		e.preventDefault();

		const dx = e.clientX - dragStartX;
		const dy = e.clientY - dragStartY;

		const canvasRect = canvas.getBoundingClientRect();
		const elementRect = selectedElement.getBoundingClientRect();

		let newLeft = elementStartLeft + dx;
		let newTop = elementStartTop + dy;

		// Apply boundary constraints (optional - comment out if you want elements to go outside canvas)
		/*
		if (newLeft < 0) newLeft = 0;
		if (newTop < 0) newTop = 0;
		if (newLeft + elementRect.width > canvasRect.width) {
			newLeft = canvasRect.width - elementRect.width;
		}
		if (newTop + elementRect.height > canvasRect.height) {
			newTop = canvasRect.height - elementRect.height;
		}
		*/

		selectedElement.style.left = `${newLeft}px`;
		selectedElement.style.top = `${newTop}px`;

		updatePropertiesPanelValues();
	}

	function handleDragEnd() {
		if (isDragging && selectedElement) {
			selectedElement.classList.remove("dragging");
		}
		isDragging = false;
	}

	function selectElement(element) {
		deselectAllElements();

		element.classList.add("selected");
		selectedElement = element;
		elemControls.classList.remove("hidden");
		updatePropertiesPanelValues();
		updatePropertiesPanelVisibility(true);
		if (element.classList.contains("text-element")) {
			updateTextStyleButtonsState();
		}
	}

	function updateTextStyleButtonsState() {
		if (!selectedElement || !selectedElement.classList.contains("text-element"))
			return;

		const textElement = selectedElement.querySelector("p");

		textStyleBtns.forEach((btn) => btn.classList.remove("active"));
		alignmentBtns.forEach((btn) => btn.classList.remove("active"));

		if (textElement.style.fontWeight === "bold") {
			document.getElementById("bold-btn").classList.add("active");
		}

		if (textElement.style.fontStyle === "italic") {
			document.getElementById("italic-btn").classList.add("active");
		}

		if (textElement.style.textDecoration === "underline") {
			document.getElementById("underline-btn").classList.add("active");
		}

		const alignment = textElement.style.textAlign || "left";
		document.getElementById(`align-${alignment}`).classList.add("active");

		if (textElement.style.fontFamily) {
			const fontFamily = textElement.style.fontFamily.replace(/['"]+/g, "");

			const options = fontFamilySelect.options;
			for (let i = 0; i < options.length; i++) {
				if (options[i].value === fontFamily) {
					fontFamilySelect.selectedIndex = i;
					break;
				}
			}
		}
	}

	function deselectAllElements() {
		const elements = document.querySelectorAll(".canvas-element");
		elements.forEach((el) => {
			el.classList.remove("selected");
		});

		elemControls.classList.add("hidden");
		selectedElement = null;

		updatePropertiesPanelVisibility(false);
	}

	function updatePropertiesPanelValues() {
		if (!selectedElement) return;

		const left = parseInt(selectedElement.style.left) || 0;
		const top = parseInt(selectedElement.style.top) || 0;

		let width, height;

		if (selectedElement.classList.contains("triangle")) {
			width = parseInt(selectedElement.style.borderRight) * 2 || 100;
			height = parseInt(selectedElement.style.borderBottom) || 100;
		} else {
			width =
				parseInt(selectedElement.style.width) || selectedElement.offsetWidth;
			height =
				parseInt(selectedElement.style.height) || selectedElement.offsetHeight;
		}

		elementXInput.value = Math.round(left);
		elementYInput.value = Math.round(top);
		elementWidthInput.value = Math.round(width);
		elementHeightInput.value = Math.round(height);
	}

	function updatePropertiesPanelVisibility(hasSelection) {
		propertyGroups.forEach((group) => {
			group.style.display = hasSelection ? "block" : "none";
		});

		if (emptyState) {
			emptyState.style.display = hasSelection ? "none" : "block";
		}

		if (hasSelection && selectedElement) {
			const textProperties = document.querySelector(".text-properties");

			if (selectedElement.classList.contains("text-element")) {
				if (textProperties) textProperties.style.display = "block";
			} else {
				if (textProperties) textProperties.style.display = "none";
			}
		}
	}

	function deleteSelectedElement() {
		if (!selectedElement) return;

		selectedElement.remove();
		elemControls.classList.add("hidden");
		selectedElement = null;

		updatePropertiesPanelVisibility(false);

		showNotification("Element deleted", "info");
	}

	function duplicateSelectedElement() {
		if (!selectedElement) return;

		const clone = selectedElement.cloneNode(true);

		const left = parseInt(selectedElement.style.left) || 0;
		const top = parseInt(selectedElement.style.top) || 0;

		clone.style.left = `${left + 20}px`;
		clone.style.top = `${top + 20}px`;
		clone.style.zIndex = currentZIndex++;

		canvas.appendChild(clone);

		addElementEventListeners(clone);

		if (clone.classList.contains("text-element")) {
			const textContent = clone.querySelector("p");
			if (textContent) {
				const newTextContent = textContent.cloneNode(true);
				textContent.parentNode.replaceChild(newTextContent, textContent);
				addElementEventListeners(clone);
			}
		}
		selectElement(clone);
		showNotification("Element duplicated", "success");
	}

	function bringToFront() {
		if (!selectedElement) return;

		selectedElement.style.zIndex = currentZIndex++;
		showNotification("Brought to front", "info");
	}

	function sendToBack() {
		if (!selectedElement) return;

		selectedElement.style.zIndex = 0;
		showNotification("Sent to back", "info");
	}

	function updateElementDimensions() {
		if (!selectedElement) return;

		const width = parseInt(elementWidthInput.value) || 10;
		const height = parseInt(elementHeightInput.value) || 10;

		if (selectedElement.classList.contains("triangle")) {
			const halfWidth = Math.round(width / 2);
			selectedElement.style.borderLeft = `${halfWidth}px solid transparent`;
			selectedElement.style.borderRight = `${halfWidth}px solid transparent`;
			selectedElement.style.borderBottom = `${height}px solid ${
				selectedElement.style.borderBottomColor || "#fab005"
			}`;
		} else {
			selectedElement.style.width = `${width}px`;
			selectedElement.style.height = `${height}px`;
		}
	}

	function updateElementPosition() {
		if (!selectedElement) return;

		const left = parseInt(elementXInput.value) || 0;
		const top = parseInt(elementYInput.value) || 0;

		selectedElement.style.left = `${left}px`;
		selectedElement.style.top = `${top}px`;
	}

	function updateTextFont() {
		if (!selectedElement || !selectedElement.classList.contains("text-element"))
			return;

		const textElement = selectedElement.querySelector("p");
		textElement.style.fontFamily = fontFamilySelect.value;
	}

	function applyTextStyle(e) {
		if (!selectedElement || !selectedElement.classList.contains("text-element"))
			return;

		const textElement = selectedElement.querySelector("p");
		const styleType = e.currentTarget.id;
		const button = e.currentTarget;

		switch (styleType) {
			case "bold-btn":
				textElement.style.fontWeight =
					textElement.style.fontWeight === "bold" ? "normal" : "bold";
				button.classList.toggle("active");
				break;
			case "italic-btn":
				textElement.style.fontStyle =
					textElement.style.fontStyle === "italic" ? "normal" : "italic";
				button.classList.toggle("active");
				break;
			case "underline-btn":
				textElement.style.textDecoration =
					textElement.style.textDecoration === "underline"
						? "none"
						: "underline";
				button.classList.toggle("active");
				break;
		}
	}

	function applyTextAlignment(e) {
		if (!selectedElement || !selectedElement.classList.contains("text-element"))
			return;

		const textElement = selectedElement.querySelector("p");
		const alignType = e.currentTarget.id;

		alignmentBtns.forEach((btn) => btn.classList.remove("active"));

		e.currentTarget.classList.add("active");

		switch (alignType) {
			case "align-left":
				textElement.style.textAlign = "left";
				break;
			case "align-center":
				textElement.style.textAlign = "center";
				break;
			case "align-right":
				textElement.style.textAlign = "right";
				break;
		}
	}

	function applyColor(e) {
		if (!selectedElement) return;

		const color = e.currentTarget.style.backgroundColor;

		if (selectedElement.classList.contains("text-element")) {
			const textElement = selectedElement.querySelector("p");
			textElement.style.color = color;
		} else if (selectedElement.classList.contains("shape-element")) {
			if (selectedElement.classList.contains("triangle")) {
				selectedElement.style.borderBottomColor = color;
			} else {
				selectedElement.style.backgroundColor = color;
			}
		}
	}

	function handleTouchMove(e) {
		if (!isDragging || !selectedElement) return;

		e.preventDefault();

		const touch = e.touches[0];
		const touchEvent = {
			clientX: touch.clientX,
			clientY: touch.clientY,
		};

		const dx = touchEvent.clientX - dragStartX;
		const dy = touchEvent.clientY - dragStartY;

		let newLeft = elementStartLeft + dx;
		let newTop = elementStartTop + dy;

		selectedElement.style.left = `${newLeft}px`;
		selectedElement.style.top = `${newTop}px`;

		updatePropertiesPanelValues();
	}

	function handleTouchEnd(e) {
		if (isDragging && selectedElement) {
			selectedElement.classList.remove("dragging");
		}
		isDragging = false;
	}
});
