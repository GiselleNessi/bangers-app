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

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(1);

  // Calculate the files to display in each tab
  const filesForTab1 = filteredFiles.slice(-333); // Get the last 333 images
  const filesForTab2 = filteredFiles; // All images


  const loadAllFiles = async () => {
    try {
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
                placeholder="Search by number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {/* Tab Navigation */}
                  <div className="tabs">
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                    <button
                      onClick={() => setActiveTab(1)}
                      className={activeTab === 1 ? 'active' : ''}
                    >
                      First Show
                    </button>
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                    <button
                      onClick={() => setActiveTab(2)}
                      className={activeTab === 2 ? 'active' : ''}
                    >
                      Second show
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div>
                    {activeTab === 1 && (
                      <div className="file-viewer">
                        {filesForTab1.map((file, index) => (
                          <div key={`${file.ipfs_pin_hash}-${index}`} className="file-item">
                            <a
                              href={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                              download={file.metadata.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                                alt="File"
                                width={200}
                                height={200}
                                onLoad={() => console.log('Image loaded')}
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* End of Tab 1 Content */}

                    {activeTab === 2 && (
                      <div className="file-viewer">
                        {filesForTab2.map((file, index) => (
                          <div key={`${file.ipfs_pin_hash}-${index}`} className="file-item">
                            <a
                              href={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                              download={file.metadata.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={`${GATEWAY_URL}/ipfs/${file.ipfs_pin_hash}`}
                                alt="File"
                                width={200}
                                height={280}
                                onLoad={() => console.log('Image loaded')}
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* End of Tab 2 Content */}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
