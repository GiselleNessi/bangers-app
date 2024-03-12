import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

  const loadAllFiles = async () => {
    try {
      console.log("Fetching all files...");
      const res = await fetch(`/api/files`);
      const json = await res.json();
      setFiles(json);
      setFilteredFiles(json);
      setLoading(false);
    } catch (e) {
      console.log("Error:", e);
      setError("Trouble loading files");
    }
  };

  useEffect(() => {
    loadAllFiles();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    let regex;
    if (/^\d{1,3}$/.test(query)) {
      regex = new RegExp(`\\b${query}\\b`, 'i');
    } else {
      regex = new RegExp(`(^|[^0-9])${query}(?![0-9])`, 'i');
    }
    const filtered = files.filter((file) =>
      regex.test(file.metadata.name.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  return (
    <>
      <Head>
        <title>Bangers</title>
        <meta name="description" content="ART FUCKING MATTERS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="logo">
          <Image src="/Logo_Negro.png" alt="Logo" height={300} width={500} />
        </div>
        <div className="container">
          <div className="copy">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div className="file-viewer">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="file-viewer">
                  {filteredFiles.map((file, index) => (
                    <div key={`${file.ipfs_pin_hash}-${index}`} className="file-item">
                      <a
                        href={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                        download={file.metadata.name}
                      >
                        <img
                          src={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                          alt="File"
                          style={{ width: "100%", height: "auto" }}
                          onLoad={() => console.log('Image loaded')}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
