task :default => :generate

desc 'Create new post with rake "post[post-name]"'
task :post, [:title] do |t, args|
  if args.title then
    new_post(args.title)
  else
    puts 'rake "post[post-name]"'
  end
end

desc 'Build site with Jekyll'
task :generate => [:clean, :scss] do
  `jekyll`
end

desc 'Start server'
task :server => [:clean, :scss] do
  `jekyll serve -t`
end

desc 'Deploy with rake "depoly[comment]"'
task :deploy, [:comment] => :generate do |t, args|
  if args.comment then
    `git commit . -m '#{args.comment}' && git push`
  else
    `git commit . -m 'new deployment' && git push`
  end
end

desc 'Clean up'
task :clean do
  `rm -rf _site`
end

def new_post(title)
  time = Time.now
  filename = "_posts/" + time.strftime("%Y-%m-%d-") + title + '.md'
  if File.exist? filename then
    puts "Post already exists: #{filename}"
    return
  end
  uuid = `uuidgen | tr "[:upper:]" "[:lower:]" | tr -d "\n"`
  File.open(filename, "wb") do |f|
    f << <<-EOS
---
title: "[TBD]#{title}"
layout: post
categories: sddtc
date: "#{time.strftime("%Y-%m-%d")}"
guid: urn:uuid:#{uuid}
tags:
  - 
---


EOS
  %x[echo "#{filename}" | pbcopy]
  end
  puts "created #{filename}"
  `git add #{filename}`
end
