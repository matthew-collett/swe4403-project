# Detect OS
ifeq ($(OS),Windows_NT)
	DETECTED_OS := Windows
	# Use PowerShell commands for Windows
	RM := powershell -Command "Remove-Item -Recurse -Force"
	MKDIR := powershell -Command "New-Item -ItemType Directory -Force"
	ECHO := powershell -Command "Write-Host"
	# Use .cmd extension for scripts on Windows
	SCRIPT_EXT := .cmd
else
	DETECTED_OS := $(shell uname -s)
	RM := rm -rf
	MKDIR := mkdir -p
	ECHO := echo
	SCRIPT_EXT := .sh
endif

# Directories
ROOT_DIR := $(shell pwd)
UI_DIR := $(ROOT_DIR)/ui
API_DIR := $(ROOT_DIR)/api
SERVICES_DIR := $(ROOT_DIR)/services

# Tools
YARN := yarn

# Colors
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Logs
define log
	@$(ECHO) "$(CYAN)$(1)$(NC)"
endef

define error
	@$(ECHO) "$(RED)error: $(1)$(NC)"
	@exit 1
endef

define warning
	@$(ECHO) "$(YELLOW)warning: $(1)$(NC)"
endef

define success
	@$(ECHO) "$(GREEN)success: $(1)$(NC)"
endef

.PHONY: help
help: ## Display this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: ui-install
ui-install: ## Install UI dependencies
	$(call log,"installing ui dependencies...")
	@cd $(UI_DIR) && $(YARN) install
	$(call success,"ui dependencies installed!")

.PHONY: ui-start
ui-start: ## Start the UI development server
	$(call log,"starting ui development server...")
	@cd $(UI_DIR) && $(YARN) dev

.PHONY: ui
ui: ui-install ui-start ## Install dependencies and start UI dev server

.PHONY: ui-clean
ui-clean: ## Clean UI build artifacts
	$(call log,"cleaning ui build artifacts...")
	@cd $(UI_DIR) && $(RM) dist
	@cd $(UI_DIR) && $(RM) node_modules
	$(call success,"ui cleaned!")