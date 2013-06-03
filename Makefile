UGLIFYJS = node node_modules/.bin/uglifyjs
YUICOMPRESSOR = yuicompressor
VIRTUALENV = python bin/virtualenv.py
VIRTUALENV_LOC = venv
ACTIVATE = source $(VIRTUALENV_LOC)/bin/activate
REQUIREMENTS = requirements.txt
R_JS = node node_modules/.bin/r.js

install: $(VIRTUALENV_LOC)
	$(ACTIVATE); pip install -r requirements.txt
	npm install
	@echo "*** Dependencies installed. ***"
	@echo "- Use \"make build_js\" to create minified scripts."
	@echo "- Use \"make watch\" to auto-minify during development."

watch:
	$(ACTIVATE); watchmedo tricks tricks.yml

build_js: wp.min.js slate.min.js wp_mobile.min.js

%.min.js: js/%/main.js
	$(R_JS) -o build/$(basename $(basename $@)).js out=js/min/$@

$(VIRTUALENV_LOC):
	$(VIRTUALENV) $(VIRTUALENV_LOC) --no-site-packages
