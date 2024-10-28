import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Download, Upload, Clock, MapPin, Network, Loader2 } from "lucide-react";

const API_BASE_URL = 'http://localhost:3000';

const SpeedTest = () => {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState(null);

  const [results, setResults] = useState({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    location: 'Loading...',
    ipAddress: 'Loading...',
    rankings: []
  });

  // Separate function to fetch location data
  const fetchLocation = async () => {
    try {
      console.log('Fetching location...');
      const response = await fetch(`${API_BASE_URL}/location`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch location');
      const data = await response.json();
      console.log('Location data:', data);
      
      setResults(prev => ({
        ...prev,
        location: data.city || 'Location Unavailable'
      }));
    } catch (error) {
      console.error('Error fetching location:', error);
      setResults(prev => ({
        ...prev,
        location: 'Location Unavailable'
      }));
    }
  };

  // Separate function to fetch IP data
  const fetchIP = async () => {
    try {
      console.log('Fetching IP...');
      const response = await fetch(`${API_BASE_URL}/ip`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch IP');
      const data = await response.json();
      console.log('IP data:', data);
      
      setResults(prev => ({
        ...prev,
        ipAddress: data.ip || 'IP Unavailable'
      }));
    } catch (error) {
      console.error('Error fetching IP:', error);
      setResults(prev => ({
        ...prev,
        ipAddress: 'IP Unavailable'
      }));
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rankings`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch rankings');
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        rankings: data.rankings || []
      }));
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setError('Failed to fetch global rankings');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchLocation(),
          fetchIP(),
          fetchRankings()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeData();

    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const runSpeedTest = async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fast-cli/test/${type}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`${type} test failed: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to complete ${type} test: ${error.message}`);
    }
  };

  const startTest = async () => {
    setIsTestStarted(true);
    setIsLoading(true);
    setError(null);

    try {
      // Run tests sequentially
      const downloadData = await runSpeedTest('download');
      setResults(prev => ({
        ...prev,
        downloadSpeed: parseFloat(downloadData.speed) || 0
      }));

      const uploadData = await runSpeedTest('upload');
      setResults(prev => ({
        ...prev,
        uploadSpeed: parseFloat(uploadData.speed) || 0
      }));

      const pingResponse = await fetch(`${API_BASE_URL}/fast-cli/ping`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!pingResponse.ok) throw new Error('Ping test failed');
      const pingData = await pingResponse.json();
      setResults(prev => ({
        ...prev,
        ping: Math.round(pingData.ping) || 0
      }));

      // Refresh location and IP after speed test
      await Promise.all([
        fetchLocation(),
        fetchIP()
      ]);

    } catch (error) {
      console.error('Error during speed test:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-primary rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
      <div className="mt-8 text-xl font-semibold">Loading</div>
      <div className="mt-2 text-muted-foreground">Please wait while we set things up</div>
    </div>
  );

  const TestLoadingAnimation = () => (
    <div className="grid grid-cols-3 gap-6 mb-12">
      <Card className="bg-card/50 backdrop-blur animate-pulse">
        <CardContent className="p-6 text-center">
          <Download className="h-6 w-6 mx-auto mb-2 text-blue-500 animate-bounce" />
          <div className="h-8 w-24 mx-auto bg-primary/20 rounded mb-2"></div>
          <div className="h-4 w-32 mx-auto bg-primary/10 rounded"></div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur animate-pulse">
        <CardContent className="p-6 text-center">
          <Upload className="h-6 w-6 mx-auto mb-2 text-green-500 animate-bounce" />
          <div className="h-8 w-24 mx-auto bg-primary/20 rounded mb-2"></div>
          <div className="h-4 w-32 mx-auto bg-primary/10 rounded"></div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur animate-pulse">
        <CardContent className="p-6 text-center">
          <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500 animate-bounce" />
          <div className="h-8 w-24 mx-auto bg-primary/20 rounded mb-2"></div>
          <div className="h-4 w-32 mx-auto bg-primary/10 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen p-8 bg-background transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Internet Speed Test</h1>
          <p className="text-muted-foreground">Check your connection speed in seconds</p>
        </div>

        {/* Start Test Button */}
        <div className="mb-12">
          <Button
            onClick={startTest}
            disabled={isLoading}
            className="w-64 h-16 mx-auto rounded-full flex items-center justify-center bg-primary hover:bg-primary/90 relative overflow-hidden group"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <Network className="mr-2 h-5 w-5" />
                Start Speed Test
              </>
            )}
          </Button>
        </div>

        {/* Speed Results or Loading Animation */}
        {isLoading ? (
          <TestLoadingAnimation />
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-12">
            <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Download className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold mb-1">{results.downloadSpeed.toFixed(1)} Mbps</div>
                <div className="text-sm text-muted-foreground">Download Speed</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold mb-1">{results.uploadSpeed.toFixed(1)} Mbps</div>
                <div className="text-sm text-muted-foreground">Upload Speed</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold mb-1">{results.ping} ms</div>
                <div className="text-sm text-muted-foreground">Ping</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Location and IP Info */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{results.location}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Network className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-medium">{results.ipAddress}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Rankings */}
        {results.rankings.length > 0 && (
          <Card className="bg-card/50 backdrop-blur transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Global Speed Rankings</h3>
              <div className="space-y-3">
                {results.rankings.map((rank) => (
                  <div key={rank.rank} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">#{rank.rank}</span>
                      <span>{rank.country}</span>
                    </div>
                    <span className="font-medium">{rank.speed} Mbps</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedTest;