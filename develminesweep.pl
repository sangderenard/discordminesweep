#!/usr/bin/perl

use strict;
use warnings;
my $arguments = join "' '", @ARGV;
#printf ("calling ./develminesweep.sh '$arguments' from '@ARGV'");

sub immediatedump {
	printf ( "Content-type: text/plain; charset=utf=8\n\n$ENV{REQUEST_URI}\n\n" );
	
#	exit;
}

#immediatedump;
exec ("./develminesweep.sh '$arguments'");
#exec ('./rungenerator');
#my $page = exec ("./develminesweep.sh '$arguments'");
#printf ("output: $page");
