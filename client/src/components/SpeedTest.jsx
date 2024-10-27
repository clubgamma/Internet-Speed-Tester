import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Download, Upload, Clock, MapPin, Network } from "lucide-react";
import { useTheme } from 'next-themes';

const SpeedTest = () => {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Simulated test results
  const [results, setResults] = useState({
    downloadSpeed: 7,
    uploadSpeed: 12,
    ping: 23,
    location: 'Gadva, IN',
    ipAddress: '240f:4900:53e8:8b28:399f:bcc8:6c1e:2a4b'
  });

  // Only render theme switch after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const startTest = () => {
    setIsTestStarted(true);
    // Add your speed test logic here
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen p-8 bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Internet Speed Test
          </h1>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full w-10 h-10"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-muted-foreground mb-8 text-center">
          Check your connection speed in seconds
        </p>

        <Button 
          className="w-full max-w-md mx-auto mb-8 py-6 text-lg flex items-center gap-2 justify-center"
          onClick={startTest}
        >
          Start Speed Test
        </Button>

        {isTestStarted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Download Speed</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{results.downloadSpeed} Mbps</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload Speed</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{results.uploadSpeed} Mbps</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Ping</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{results.ping} ms</p>
              </CardContent>
            </Card>
          </div>
        )}

        {isTestStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-xl text-foreground">{results.location}</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-indigo-500 mb-2">
                  <Network className="h-5 w-5" />
                  <span className="font-medium">IP Address</span>
                </div>
                <p className="text-xl break-all text-foreground">{results.ipAddress}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Global Speed Rankings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Rank</th>
                    <th className="text-left py-2 text-muted-foreground">Country</th>
                    <th className="text-right py-2 text-muted-foreground">Mbps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 text-foreground">1</td>
                    <td className="text-foreground">United Arab Emirates</td>
                    <td className="text-right text-blue-500">413.14</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-foreground">2</td>
                    <td className="text-foreground">Qatar</td>
                    <td className="text-right text-blue-500">350.5</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-foreground">3</td>
                    <td className="text-foreground">Kuwait</td>
                    <td className="text-right text-blue-500">252.15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeedTest;