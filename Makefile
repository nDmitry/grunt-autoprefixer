
compile:
	sassc -o test/fixtures/sm.css test/fixtures/sm.scss
	sassc -g -o test/fixtures/sm_update.css test/fixtures/sm_update.scss
	sassc -g -o test/fixtures/sm_update_by_path.css test/fixtures/sm_update_by_path.scss

.PHONY: compile
