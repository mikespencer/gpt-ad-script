UGLIFYJS = node node_modules/.bin/uglifyjs
YUICOMPRESSOR = yuicompressor
VIRTUALENV = python bin/virtualenv.py
VIRTUALENV_LOC = venv
ACTIVATE = source $(VIRTUALENV_LOC)/bin/activate
REQUIREMENTS = requirements.txt
R_JS = node node_modules/.bin/r.js
GPT_LOCAL = js/lib/gpt.js
GPT_URL = http://www.googletagservices.com/tag/js/gpt.js

install: $(VIRTUALENV_LOC) gpt
	$(ACTIVATE); pip install -r requirements.txt
	npm install

	@echo "*** Dependencies installed. ***"
	@echo "- Use \"make gpt\" to download/update to latest GPT script."
	@echo "- Use \"make build_js\" to create minified scripts."
	@echo "- Use \"make watch\" to auto-minify during development."

watch:
	$(ACTIVATE); watchmedo tricks tricks.yml

build_js: wp.min.js slate.min.js wp_mobile.min.js build_loader

build_loader:
	$(UGLIFYJS) js/loader.js -c -m -o js/min/loader.min.js

gpt:
	curl --silent --create-dirs -o $(GPT_LOCAL) $(GPT_URL)

%.min.js: js/modules/%/main.js
	$(R_JS) -o build/$(basename $(basename $@)).js

$(VIRTUALENV_LOC):
	$(VIRTUALENV) $(VIRTUALENV_LOC) --no-site-packages

.PHONY: build_js build_loader gpt watch install
