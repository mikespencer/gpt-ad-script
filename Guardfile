# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'livereload' do
  # Any css or html files:
  watch(%r{.+\.(css|html)})

  # Once optimiser has run:
  watch(%r{.+loader\.min\.js})

  # This doesn't go through the optimiser:
  watch(%r{.+debug\.js})
end
