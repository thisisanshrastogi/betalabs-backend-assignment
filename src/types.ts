interface writeProps {
  data: Array<{ [key: string]: any }>;
  collection: string;
}

interface createCollectionProps {
  name: string;
}

interface readProps {
  collection: string;
  query: { [key: string]: any };
}

interface updateProps {
  collection: string;
  query: { [key: string]: any };
  newdata: { [key: string]: any };
}

interface deleteManyProps {
  query: { [key: string]: any };
  collection: string;
}
