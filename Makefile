ifeq ($(OS),Windows_NT)
 # Windows-specific settings
 PYTHON = python
 VENV_ACTIVATE = $(VENV)/Scripts/activate
 RM = rmdir /s /q
else
 # Unix-specific settings
 PYTHON = python3.10
 VENV_ACTIVATE = $(VENV)/bin/activate
 RM = rm -rf
endif

# Basic commands - override if needed
PIP = pip3
VENV = api/venv
YARN = yarn
API_PORT = 5000

.PHONY: setup api ui clean

# Help message
help:
	@echo "Available commands:"
	@echo " make setup - Set up both UI and API dependencies"
	@echo " make ui - Start UI dev server"
	@echo " make api - Start API server (port $(API_PORT))"
	@echo " make clean - Clean build artifacts"

# Set up both projects
setup:
	@echo "Setting up UI..."
	cd ui && $(YARN) install
	@echo "Setting up API..."
	$(PYTHON) -c "import sys; exit(0 if sys.version_info[:2] == (3, 10) else 1)" || (echo "Python 3.12 required. Please install it." && exit 1)
	$(PYTHON) -m venv $(VENV)
ifeq ($(OS),Windows_NT)
	$(VENV)/Scripts/python -m pip install --upgrade pip
	$(VENV)/Scripts/python -m pip install -r api/requirements.txt
else
	. $(VENV_ACTIVATE) && pip install --upgrade pip
	. $(VENV_ACTIVATE) && cd api && $(PIP) install -r requirements.txt
endif
	@echo "Setup complete!"

# Run UI
ui:
	cd ui && $(YARN) dev

# Run API
api:
ifeq ($(OS),Windows_NT)
	cd api && set FLASK_APP=app && set FLASK_PORT=$(API_PORT) && ..\\$(VENV)\\Scripts\\python run.py
else
	cd api && FLASK_APP=app FLASK_PORT=$(API_PORT) . ../$(VENV_ACTIVATE) && python run.py
endif

# Clean everything
clean:
ifeq ($(OS),Windows_NT)
	if exist ui\node_modules $(RM) ui\node_modules
	if exist ui\dist $(RM) ui\dist
	if exist $(VENV) $(RM) $(VENV)
else
	$(RM) ui/node_modules ui/dist
	$(RM) $(VENV)
	find . -type d -name **pycache** -exec $(RM) {} +
	find . -type f -name "*.pyc" -delete
endif