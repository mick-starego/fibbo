npm run build;
touch ./docs/fibbo/CNAME;
echo fibbo.io > ./docs/fibbo/CNAME;
git add .;
git commit -m "generated deployables";
git push -u origin master;
npm run deploy;
