#Importing a lot of libraries
from lxml import html
import requests
import fileinput
from tempfile import mkstemp
from shutil import move
from os import remove, close
import os.path
import praw

#Scans HTML document and replaces all lines with given substring with a new line
def replace(file_path, old, new):
  file_path = os.path.abspath(file_path)
  #Create temp file
  fh, abs_path = mkstemp()
  new_file = open(abs_path,'w')
  old_file = open(file_path)
  #Goes through each line in file
  for line in old_file:
    flag = None
    for i, string in enumerate(old):
      #If line contains something that has to be replaces, replace it
      if string in line:
        new_file.write(new[i]+'\n')
        flag = True
    #Otherwise, rewrite the old line
    if not flag:
      new_file.write(line)
  #close temp file
  new_file.close()
  close(fh)
  old_file.close()
  #Remove original file
  remove(file_path)
  #Move new file
  move(abs_path, file_path)
  
#Quotes are weird
def fixAscii(title):
  newTitle = ""
  #Unicode values of quotes that are not in Ascii
  quoteUnicodeValues = [2018,2019,8216,8217]
  for char in title:
    #If the unicode value is less than 128, it is in Ascii and is not a problem.
    if ord(char) < 128:
      newTitle += newTitle.join(char)
    else:
      value = ord(char)
      #Otherwise, check if the value is one of the other quotes, and if it is, make it a standard Ascii quote
      if value in quoteUnicodeValues:
        newTitle += newTitle.join("'")
  return newTitle

#Scrapes webpage to get html code for comic
page = requests.get("http://www.xkcd.com")

#Parses code into tree
tree = html.fromstring(page.content)

#Uses the comic's xpath to find it on the page and scrape the url
comicUrl = "http:" + tree.xpath('//*[@id="comic"]/img/@src')[0]
hoverTextUrl = tree.xpath('//*[@id="comic"]/img/@title')[0]

#Adds applicable HTML code to put it into the webpage
comic = '<img id="comic" src="'+ comicUrl + '">'
hoverText = '<p id="comicHover">Hover Text: ' + hoverTextUrl + '</p>'
print comic
print hoverText

#Parse colors of pollen bars into their descriptions
pollenDescriptorCodes = ['F92623','FAAB31','FCFB42','A6FA40','229612']
pollenDescriptions = ['High','Medium-High','Medium','Low-Medium','Low']

#Scrapes website for color of pollen bar
page2 = requests.get("https://www.wunderground.com/DisplayPollen.asp?Zipcode=07726")
tree2 = html.fromstring(page2.content)
pollenCount = tree2.xpath('//*[@id="inner-content"]/div[1]/div[2]/div[1]/table/tr[2]/td[2]/div')[0]
pollenDescriptor = ''
print '*****************'
#Substrings color of bar to get RGB code
style = pollenCount.attrib['style'][-7:-1]
for c,d in enumerate(pollenDescriptorCodes):
  if style == d:
    pollenDescriptor = pollenDescriptions[c]
print pollenDescriptor
print '*****************'
placeholders = []
for i in range(10):
  placeholders.append('p'+str(i+1))
  
tags = ['comic','comicHover']

#Add ID tags to array of flags that have to be replaced
for x in placeholders:
  tags.append(x)

readyToReplace = []

for x in tags:
  readyToReplace.append('id="'+x+'"')
  
readyToReplace.append('id="pollen"')
  
print readyToReplace

toReplace = []
postArray = []

#Gets top posts on news subreddit to add to webpage
reddit = praw.Reddit(user_agent='Name_Pending')
reddit.config.decode_html_entities = True
posts = reddit.get_subreddit('news').get_hot()
counter = 0
while counter < 10:
  post = posts.next()
  if not post.stickied:
    post = fixAscii(post.title)
    postArray.append(post)
    counter = counter + 1
  
toReplace.append(comic)
toReplace.append(hoverText)

#Craft new lines to be added to the page
for i, post in enumerate(postArray):
  toReplace.append('<li class="post" ' + readyToReplace[i+2] + '>' + post + '</li>')
  
toReplace.append('<p class="weatherPart" id="pollen">' + pollenDescriptor + '</p>')
  
print '*************************************'

#Replace everything
replace('/home/jared/Downloads/SeniorProject/wakeup.html',readyToReplace,toReplace)